import { Id } from '../common/identifier'
import { ProjectDbRow, ProjectRole, PublicUserDbRow, OrganizationRole, } from '../db/schema'

import { GetOrganizationProjectsResultStatus, UserAddedToOrganizationEventData } from '../organizations/types'
import { LoggerInterface } from '../../../../infrastructure/logger'
import { defaultsDeep } from 'lodash';
import { OnboardingMessageSender } from './OnboardingMessageSender'
import { ProjectServiceInterface } from '../projects/interfaces/ProjectServiceInterface';
import { CreateProjectStatus, UserInProjectJson } from '../projects/types';
import { TaskServiceInterface } from '../tasks/interfaces/TaskServiceInterface';
import { inject, injectable } from 'inversify';
import { ProjectsModule } from '../projects/ProjectsModule';
import { TasksModule } from '../tasks/TasksModule';
import { TaskCreatedEventData } from '../tasks/types';
import { CommonModule } from '../common/CommonModule';
import { OrganizationsModule } from '../organizations/OrganizationsModule';
import { BotServiceConfig, CreateBotResult, CreateBotStatus, OnboardingType } from './types';
import { BotServiceInterface } from './BotServiceInterface';
import { BotModule } from './BotModule';
import { SchedulerInterface } from '../common/scheduler/SchedulerInterface';
import { OrganizationServiceInterface } from '../organizations/interfaces/OrganizationServiceInterface';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { BotProviderInterface } from './BotProviderInterface'
import { UserInOrganizationProviderInterface } from '../organizations/interfaces/UserInOrganizationProviderInterface';
import { ProjectPeopleServiceInterface } from '../projects/interfaces/ProjectPeopleServiceInterface';
import { DbModule } from '../db/DbModule';
import { ConnectionInterface } from '../db/ConnectionInterface';
import { autojoinableProjectsModifier } from './queryDecorators';
import { ConversationServiceInterface } from '../projects/interfaces/ConversationServiceInterface';

const DEFAULT_OPTIONS: BotServiceConfig = {
  initialOnboardingDelaySeconds: 15,
  taskCountThreshold: 8,
  returningSessionNumber: 2,
}

@injectable()
export class BotService
implements BotServiceInterface {
  protected options: BotServiceConfig;

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
    @inject(BotModule.OnboardingMessageSender)
    private onboardingMessageSender: OnboardingMessageSender,
    @inject(CommonModule.SchedulerInterface)
    private scheduler: SchedulerInterface,
    @inject(OrganizationsModule.OrganizationServiceInterface)
    private organizationService: OrganizationServiceInterface,
    @inject(ProjectsModule.ProjectServiceInterface)
    private projectService: ProjectServiceInterface,
    @inject(TasksModule.TaskServiceInterface)
    private taskService: TaskServiceInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    private userInOrganizationProvider: UserInOrganizationProviderInterface,
    @inject(BotModule.BotProviderInterface)
    private botProvider: BotProviderInterface,
    @inject(ProjectsModule.ProjectPeopleServiceInterface)
    private projectPeopleService: ProjectPeopleServiceInterface,
    @inject(ProjectsModule.ConversationServiceInterface)
    private conversationService: ConversationServiceInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
    @inject(BotModule.BotServiceConfig)
    options?: BotServiceConfig,
  ) {
    this.options = defaultsDeep({}, options || {}, DEFAULT_OPTIONS);
    this.attachToEntityEvents();
  }

  async createBotForOrganization(organizationId: Id): Promise<CreateBotResult> {
    return await this.connection.getConnection()
      .transaction(async trx => {
        const bot = await this.botProvider.getBotForOrganization(organizationId, trx);
        if (bot) {
          return { status: CreateBotStatus.BOT_ALREADY_EXISTS };
        }
        return this.botProvider.createBotForOrganization(trx, organizationId);
      });
  }

  /**
   * Watches for some events:
   *  - task creation
   *  - adding user to organization
   *  - user going online
   *
   *  Bot does perform actions in response to those events.
   */
  protected attachToEntityEvents() {
    this.logger.info('Attached to entity events')
    this.organizationService.userAddedToOrganizationEvent.attach(this.onUserAddedToOrganization.bind(this));
    this.taskService.taskCreatedEvent.attach(this.onTaskCreated.bind(this));
  }

  async onTaskCreated(params: TaskCreatedEventData) {
    const { task, creatorId, trx } = params;
    if (!task.projectId) {
      // No way to determine organizationId.
      return;
    }
    const project = await this.projectService.getProject(task.projectId, trx);

    const userTaskCount = await this.taskService.getCreatedTaskCount(creatorId, project.organizationId, trx);

    if (userTaskCount === this.options.taskCountThreshold) {
      await this.sendOnboardingMessages(OnboardingType.TASK_CREATED, project.organizationId, creatorId, trx);
    }
  }



  async onUserAddedToOrganization(params: UserAddedToOrganizationEventData) {
    const { trx, organizationId, userId } = params;

    this.logger.info(`Scheduling welcome onboarding for user ${userId} and org ${organizationId} in ${this.options.initialOnboardingDelaySeconds} seconds...`);
    this.scheduler.setTimeout(
      this.options.initialOnboardingDelaySeconds * 1000,
      this.sendOnboardingMessages.bind(this, OnboardingType.WELCOME, organizationId, userId)
    );

    const bot = await this.botProvider.getBotForOrganization(organizationId, trx);
    if (!bot) {
      this.logger.warn(`No bot in organization: ${organizationId}`);
      return;
    }
    if (bot && bot.id === userId) {
      // No need to create self chat for bot;
      return;
    }

    const userInOrganization = await this.userInOrganizationProvider.getUserInOrganization(userId, organizationId, trx)

    await this.botProvider.createConversationWithBot(trx, organizationId, userId, bot);
    if (userInOrganization.role !== OrganizationRole.GUEST) {
      await this.doAddUserToSampleProject(trx, organizationId, userId, bot)
    }
  }


  protected async sendOnboardingMessages(type: OnboardingType, organizationId: Id, userId: Id, trx?: Transaction) {
    this.logger.debug(`Onboarding (${type}) for user ${userId}`);
    const bot = await this.botProvider.getBotForOrganization(organizationId, trx);
    if (!bot) {
      this.logger.warn(`No bot in organization: ${organizationId} -- cannot perform ${type} onboarding`);
      return;
    }
    if (bot.id === userId) {
      return;
    }
    const conversation = await this.conversationService.getConversation(organizationId, [bot.id, userId], trx);
    let conversationId = null
    if (!conversation) {
      this.logger.info(`No conversation with bot [${bot.id}] for user [${userId}] although it should already exist (org [${organizationId}])!`);
      const conversationResult = await this.conversationService.doCreateConversation(trx, bot.id, [bot.id, userId], organizationId);
      if (conversationResult.status !== CreateProjectStatus.OK) {
        this.logger.warn(`Could not create conversation between bot [${bot.id}] and user [${userId}] (org [${organizationId}])`);
        return;
      } else {
        conversationId = conversationResult.project.id
      }
    } else {
      conversationId = conversation.id
    }


    await this.onboardingMessageSender.sendOnboardingMessages(
      type,
      conversationId,
      bot
    );
  }

  private async doAddUserToSampleProject(trx: Transaction, organizationId: Id, userId: Id, bot: PublicUserDbRow) {
    this.logger.verbose(`User [${userId}] added to organization [${organizationId}]: adding do Demo Space...`)
    const sampleProject = await this.getSampleProjectForOrganization(organizationId, trx);
    if (!sampleProject) {
      this.logger.info(`Organization [${organizationId}] has no sample project -- will not add user [${userId}] as member`);
      return null;
    }
    const userInSampleProject: UserInProjectJson = {
      projectId: sampleProject.id,
      userId,
      role: ProjectRole.MEMBER,
    };
    await this.projectPeopleService.doAddProjectPerson(
      trx,
      userInSampleProject,
      bot.id
    )
    this.logger.verbose('\tadded to demo space')
  }

  async getSampleProjectForOrganization(organizationId: Id, trx?: Transaction): Promise<ProjectDbRow> {
    const sampleProjectResult = await this.organizationService.getOrganizationProjects(
      organizationId,
      autojoinableProjectsModifier,
      trx,
    )
    if (sampleProjectResult.status !== GetOrganizationProjectsResultStatus.OK) {
      return null;
    }

    return sampleProjectResult.organizationProjects.length > 0
      ? sampleProjectResult.organizationProjects[0]
      : null;
  }
}
