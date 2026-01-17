import { MessageAttachmentProviderInterface } from "../interfaces/MessageAttachmentProviderInterface";
import { injectable, inject } from "inversify";
import { Id } from "../../common/identifier";

import Table from "../../db/Table";
import { DbModule } from "../../db/DbModule";
import { ConnectionInterface } from "../../db/ConnectionInterface";

@injectable()
export class MessageAttachmentProvider implements MessageAttachmentProviderInterface {

  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ){}

  async isFileAttachedToMessages(fileId: Id, trx?: Transaction): Promise<boolean> {
    const query = this.connection.getQueryWithTransaction(trx)
    const count: number = await query
      .count()
      .from(Table.MESSAGE_FILE)
      .where({ fileId })
      .first()
      .then((result) => parseInt(result.count as string))
    return count > 0
  }
}
