import { TaskAttachmentProviderInterface } from "../interfaces/TaskAttachmentProviderInterface";
import { Id } from "../../common/identifier";

import Table from "../../db/Table";
import { injectable, inject } from "inversify";
import { DbModule } from "../../db/DbModule";
import { ConnectionInterface } from "../../db/ConnectionInterface";

@injectable()
export class TaskAttachmentProvider implements TaskAttachmentProviderInterface {
  
  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {}

  async createTaskAttachment(taskId: Id, fileId: Id, trx?: Transaction): Promise<number> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .into(Table.TASK_ATTACHMENT)
      .insert({ taskId, fileId })
  }

  async deleteTaskAttachment(taskId: Id, fileId: Id, trx?: Transaction): Promise<number> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .from(Table.TASK_ATTACHMENT)
      .where({ taskId, fileId })
      .del()
  }

  async isFileAttachedToOtherTasks(taskId: Id, fileId: Id, trx?: Transaction): Promise<boolean> {
    const query = this.connection.getQueryWithTransaction(trx)
    const attachmentsCount: number = await query
      .count()
      .from(Table.TASK_ATTACHMENT)
      .where({ fileId })
      .andWhereNot({ taskId })
      .first()
      .then((result) => parseInt(result.count as string))
    return attachmentsCount > 0
  }
}
