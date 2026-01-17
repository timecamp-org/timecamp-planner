import {
  DetermineOrderForUnarchivedSpaceJobInterface,
} from "../types";
import { inject, injectable } from "inversify";
import { JobNamespace } from "../../messageQueue/types";
import { InfrastructureModule } from "../../../../../infrastructure/InfrastructureModule";
import { LoggerInterface } from "../../../../../infrastructure/logger";
import { MessageQueueModule } from "../../messageQueue/MessageQueueModule";
import { JobStatusServiceInterface } from "../../messageQueue/interfaces/JobStatusServiceInterface";
import { ProjectPersonalStructureModule } from "../ProjectPersonalStructureModule";
import { PersonalProjectOrderServiceInterface } from "../interfaces/PersonalProjectOrderServiceInterface";
import { DbModule } from "../../db/DbModule";
import { ConnectionInterface } from "../../db/ConnectionInterface";
import { ProjectsModule } from "../../projects/ProjectsModule";
import { UserInProjectProviderInterface } from "../../projects/interfaces/UserInProjectProviderInterface";
import { chunk, last, findIndex, isNil } from "lodash";
import { ProjectsJobType } from "../../projects/types";
import { AbstractProjectsSubWorker } from "../../projects/workers/AbstractProjectsSubWorker";

export const MAX_USERS_TO_SET_ORDER_FOR = 5

@injectable()
export class DetermineOrderForUnarchivedSpaceWorker
  extends AbstractProjectsSubWorker {

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
    @inject(MessageQueueModule.JobStatusServiceInterface)
    private jobStatusService: JobStatusServiceInterface,
    @inject(ProjectPersonalStructureModule.PersonalProjectOrderServiceInterface)
    private personalProjectOrderService: PersonalProjectOrderServiceInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
    @inject(ProjectsModule.UserInProjectProviderInterface)
    private userInProjectProvider: UserInProjectProviderInterface,
  ) {
    super(ProjectsJobType.DETERMINE_ORDER_FOR_UNARCHIVED_SPACE)
  }

  async handle(job: DetermineOrderForUnarchivedSpaceJobInterface) {
    const { projectId, organizationId, lastUserId } = job
    try {
      const allPeopleInProject = await this.userInProjectProvider.getProjectPeople(projectId)
      const userIds = allPeopleInProject.map(projectPerson => projectPerson.userId)

      if (userIds.length === 0) {
        return this.logger.info('No users to determine project order for. Leaving...')
      }
      this.logger.info(`Found ${userIds.length} users to determine project order for...`)

      const projectPeopleChunks = chunk(userIds, MAX_USERS_TO_SET_ORDER_FOR)

      const previousIterationIndex = lastUserId && findIndex(projectPeopleChunks, chunk => chunk.includes(lastUserId))
      const currentIterationIndex = isNil(previousIterationIndex)
        ? 0
        : previousIterationIndex + 1
      const currentChunk = projectPeopleChunks[currentIterationIndex]

      await this.connection.getConnection().transaction(async trx => {
        const insertProjectOrderPromises = []
        for (const userId of userIds) {
          insertProjectOrderPromises.push(
            this.personalProjectOrderService.placeProjectOnTop(userId, organizationId, projectId, trx)
          )
        }
        await Promise.all(insertProjectOrderPromises)
      })
      await this.jobStatusService.incrementDoneJobs(JobNamespace.DETERMINE_ORDER_FOR_UNARCHIVED_SPACE, null, organizationId)

      if (projectPeopleChunks[currentIterationIndex + 1]) {
        this.logger.info('There are more users to determine project order for, spawning new job...')
        const lastUserIdFromCurrentJob = last(currentChunk)
        await this.personalProjectOrderService.publishDetermineOrderForUnarchivedSpaceJob(
          projectId, organizationId, lastUserIdFromCurrentJob,
        )
      }

    } catch(error) {
      this.logger.error(error)
      await this.jobStatusService.updateJobStatus(JobNamespace.DETERMINE_ORDER_FOR_UNARCHIVED_SPACE, { isFailed: true }, null, organizationId)
      throw error
    }
  }
}