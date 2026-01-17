import { BotProviderInterface } from './BotProviderInterface';

import { generateId, Id } from '../common/identifier';
import { CreateBotResult, CreateBotStatus, CreateSampleSpaceResult, CreateSampleSpaceStatus } from './types';
import { OrganizationRole, ProjectRole, PublicUserDbRow, UserDbRow } from '../db/schema';
import { UserRegistrationStatus } from '../common/enum';

import Table from '../db/Table';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { OrganizationServiceInterface } from '../organizations/interfaces/OrganizationServiceInterface';
import { CreateProjectStatus, UserInProjectJson } from '../projects/types';
import { ProjectServiceInterface } from '../projects/interfaces/ProjectServiceInterface';
import { TimeServiceInterface } from '../common/time/TimeServiceInterface';
import { inject, injectable } from 'inversify';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { OrganizationsModule } from '../organizations/OrganizationsModule';
import { ProjectsModule } from '../projects/ProjectsModule';
import { CommonModule } from '../common/CommonModule';
import { UsersModule } from '../users/UsersModule';
import { UserServiceInterface } from '../users/UserServiceInterface';
import { ProjectPeopleServiceInterface } from '../projects/interfaces/ProjectPeopleServiceInterface';
import { DbModule } from '../db/DbModule';
import { ConnectionInterface } from '../db/ConnectionInterface';
import { ConversationServiceInterface } from '../projects/interfaces/ConversationServiceInterface';
import { UserInOrganizationServiceInterface } from '../organizations/interfaces/UserInOrganizationServiceInterface';

@injectable()
export class BotProvider implements BotProviderInterface {
  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
    @inject(OrganizationsModule.OrganizationServiceInterface)
    private organizationService: OrganizationServiceInterface,
    @inject(ProjectsModule.ProjectServiceInterface)
    private projectService: ProjectServiceInterface,
    @inject(CommonModule.TimeServiceInterface)
    private timeService: TimeServiceInterface,
    @inject(UsersModule.UserServiceInterface)
    private userService: UserServiceInterface,
    @inject(ProjectsModule.ProjectPeopleServiceInterface)
    private projectPeopleService: ProjectPeopleServiceInterface,
    @inject(ProjectsModule.ConversationServiceInterface)
    private conversationService: ConversationServiceInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
    @inject(OrganizationsModule.UserInOrganizationServiceInterface)
    private userInOrganizationService: UserInOrganizationServiceInterface
  ) {}

  /**
   * Creates bot.
   * Creates chat with bot for every organization member.
   *
   * @param {Knex.Transaction} trx
   * @param {Id} organizationId
   * @return {Promise<CreateBotResult>}
   */
  async createBotForOrganization(trx: Transaction, organizationId: Id): Promise<CreateBotResult> {
    const botId = generateId();
    const botData: UserDbRow = {
      id: botId,
      firstName: 'Hey',
      lastName: 'Bot',
      email: `bot+${botId}@timecamp.com`,
      isBot: true,
      registrationStatus: UserRegistrationStatus.VERIFIED,
    };
    this.logger.verbose(`Creating HeyBot [${botId}] for organization [${organizationId}]`);
    await this.connection.getQueryWithTransaction(trx).insert(botData).into(Table.USER);
    await this.organizationService.doAddUserToOrganization(trx, organizationId, botId, OrganizationRole.MEMBER);
    this.logger.verbose(`\tadded [${botId}] to organization [${organizationId}]`);

    await this.doCreateConversationsWithBotForExistingUsers(organizationId, trx, botData);

    this.logger.debug(`Created HeyBot [${botId}] for organization [${organizationId}]`);
    return {
      status: CreateBotStatus.OK,
      botId,
    };
  }

  private async doCreateConversationsWithBotForExistingUsers(organizationId: Id, trx: Transaction, bot: UserDbRow) {
    const organizationUsers = await this.userInOrganizationService.getOrganizationPeople(organizationId, trx);

    const doStartConversations = organizationUsers
      .filter((user) => user.id != bot.id)
      .map((user) => this.createConversationWithBot(trx, organizationId, user.id, bot));
    this.logger.verbose(
      `\tfound ${doStartConversations.length} current organization members - creating chat with HeyBot...`
    );
    await Promise.all(doStartConversations);
    this.logger.verbose('\tcreated.');
  }

  async createSampleProject(
    trx: Transaction,
    organizationId: Id,
    botId: Id,
    userLanguage: string
  ): Promise<CreateSampleSpaceResult> {
    const sampleProjectId = generateId();
    this.logger.verbose(
      `Creating Demo Space [${sampleProjectId}] for organization [${organizationId}] with lang: [${userLanguage}]...`
    );

    const procedureName = this.getSampleSpaceProcedureName(userLanguage);

    const now = this.timeService.getCurrentTime();
    const sql =
      `SELECT "project-management".${procedureName}(` +
      ':sampleProjectId, ' +
      ':organizationId, ' +
      ':botId, ' +
      ':startDate' +
      ')';
    const params = {
      organizationId,
      sampleProjectId,
      botId,
      startDate: now,
    };
    await trx.raw(sql, params);
    const project = await this.projectService.getProject(sampleProjectId, trx);

    if (!project) {
      return {
        status: CreateSampleSpaceStatus.SPACE_NOT_CREATED,
      };
    }

    this.logger.verbose('\tcreated.');
    const organizationUsers = await this.userInOrganizationService.getOrganizationPeople(organizationId, trx);
    const sampleProjectMembers = organizationUsers.map(
      (user: UserDbRow): UserInProjectJson => ({
        role: ProjectRole.MEMBER,
        projectId: sampleProjectId,
        userId: user.id,
      })
    );
    this.logger.verbose(`\tfound ${sampleProjectMembers.length} users in organization to add to Demo Space`);
    await this.projectPeopleService.doAddProjectPersons(trx, sampleProjectMembers, botId);

    this.logger.debug(`Created Demo Space [${sampleProjectId}] for organization [${organizationId}]`);
    return {
      status: CreateSampleSpaceStatus.OK,
      project,
    };
  }

  getSampleSpaceProcedureName(userLanguage: string) {
    if (userLanguage === 'en') {
      return 'create_sample_space';
    } else {
      return `create_sample_space_${userLanguage}`;
    }
  }

  async createConversationWithBot(trx: Transaction, organizationId: Id, userId: Id, bot: PublicUserDbRow) {
    this.logger.verbose(`Noticed user [${userId}] added to organization [${organizationId}] - creating bot chat`);
    const conversationResult = await this.conversationService.doCreateConversation(
      trx,
      bot.id,
      [bot.id, userId],
      organizationId
    );
    if (conversationResult.status != CreateProjectStatus.OK) {
      this.logger.warn(
        `Could not create conversation with bot! (userId: ${userId}, botId: ${bot.id}, organizationId: ${organizationId})`
      );
      return;
    }

    this.logger.verbose('\tcreated chat with HeyBot.');
  }

  async getBotForOrganization(organizationId: Id, trx?: Transaction): Promise<PublicUserDbRow> {
    const bots = await this.userService.getUsersForQuery(
      (q) =>
        (trx ? q.transacting(trx) : q)
          .select(`${Table.USER}.*`)
          .where('isBot', true)
          .join(Table.USER_IN_ORGANIZATION, (join) =>
            join
              .on(`${Table.USER}.id`, `${Table.USER_IN_ORGANIZATION}.userId`)
              .on(this.connection.getConnection().raw('organization_id = ?', organizationId))
          ),
      trx
    );

    if (!bots) {
      return null;
    }

    return bots[0];
  }
}
