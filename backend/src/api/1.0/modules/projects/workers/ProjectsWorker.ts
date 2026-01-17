import { AbstractAMQPWorker } from "../../messageQueue/amqp/AbstractAMQPWorker";
import { Connection, Message } from "amqplib";
import { inject, injectable, multiInject, named } from "inversify";
import { MessageQueueModule } from "../../messageQueue/MessageQueueModule";
import { InfrastructureModule } from "../../../../../infrastructure/InfrastructureModule";
import { LoggerInterface } from "../../../../../infrastructure/logger";
import { QueueDescriptorInterface } from "../../messageQueue/interfaces/QueueDescriptorInterface";
import { CommonModule } from "../../common/CommonModule";
import { JsonSerializerInterface } from "../../common/json/JsonSerializerInterface";
import { WorkerOptionsInterface } from "../../messageQueue/types";
import { ProjectsModule } from "../ProjectsModule";
import { ProjectsJobInterface } from "../types";
import { ProjectsSubWorkerInterface } from "../interfaces/ProjectsSubWorkerInterface";

@injectable()
export class ProjectsWorker extends AbstractAMQPWorker<Message> {

  constructor(
    @inject(MessageQueueModule.MessageQueueInstanceInterface)
      mqInstance: Connection,
    @inject(InfrastructureModule.LoggerInterface)
      logger: LoggerInterface,
    @multiInject(ProjectsModule.ProjectsQueue)
      queues: QueueDescriptorInterface[],
    @inject(CommonModule.JsonSerializerInterface)
      jsonSerializer: JsonSerializerInterface,
    @inject(MessageQueueModule.WorkerOptionsInterface)
    @named('ProjectsWorker')
      options: WorkerOptionsInterface,
    @multiInject(ProjectsModule.ProjectsSubWorker)
    private subWorkers: ProjectsSubWorkerInterface[],
  ) {
    super(mqInstance, logger, options, jsonSerializer, queues)
  }

  async delegateMessage(message: ProjectsJobInterface): Promise<boolean> {
    const jobDescriptor = `${message.type}/${message.id})`;
    this.logger.debug(`Trying registered Projects sub-worker for job: ${jobDescriptor}`);
    try {
      for (const worker of this.subWorkers) {
        if (await worker.supports(message)) {
          this.logger.info(`Worker ${worker.constructor.name} supports ${jobDescriptor}.`);
          await worker.handle(message);
          return true;
        } else {
          this.logger.info(`Worker ${worker.constructor.name} does not support this job.`);
        }
      }
    } catch(error) {
      this.logger.error(error)
      return false
    }
  }
}