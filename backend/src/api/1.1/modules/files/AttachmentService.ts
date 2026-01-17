import { AttachmentServiceInterface } from "./interfaces/AttachmentServiceInterface";
import { injectable, inject } from "inversify";
import { Id } from "../common/identifier";
import { ContainerType } from "../db/schema";
import { TasksModule } from "../tasks/TasksModule";
import { TaskAttachmentProviderInterface } from "../tasks/interfaces/TaskAttachmentProviderInterface";
import { MessageAttachmentProviderInterface } from "../messages/interfaces/MessageAttachmentProviderInterface";
import { MessagesModule } from "../messages/MessagesModule";


@injectable()
export class AttachmentService implements AttachmentServiceInterface {

  constructor(
    @inject(TasksModule.TaskAttachmentProviderInterface)
    private taskAttachmentProvider: TaskAttachmentProviderInterface,
    @inject(MessagesModule.MessageAttachmentProviderInterface)
    private messageAttachmentProvider: MessageAttachmentProviderInterface,
  ) { }

  async isFileAttached(
    containerType: ContainerType,
    containerId: Id,
    fileId: Id,
    trx?: Transaction
  ): Promise<boolean> {
    switch (containerType) {
      case ContainerType.TASK: {
        const isFileAttachedToOtherTasks = await this.taskAttachmentProvider.isFileAttachedToOtherTasks(containerId, fileId, trx)
        const isFileAttachedToMessages = await this.messageAttachmentProvider.isFileAttachedToMessages(fileId, trx)
        return isFileAttachedToOtherTasks || isFileAttachedToMessages
      }
      default: {
        return false
      }
    }
  }
}
