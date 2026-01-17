import { Id } from '../../common/identifier';


export interface TaskAttachmentProviderInterface {
  createTaskAttachment(taskId: Id, fileId: Id, trx?: Transaction): PromiseLike<number>;

  deleteTaskAttachment(taskId: Id, fileId: Id, trx?: Transaction): PromiseLike<number>;

  isFileAttachedToOtherTasks(taskId: Id, fileId: Id, trx?: Transaction): PromiseLike<boolean>;
}
