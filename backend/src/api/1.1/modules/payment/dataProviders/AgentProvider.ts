import { PaymentAgentDbRow } from "../../db/schema";
import { injectable, inject } from "inversify";
import Table from "../../db/Table";
import { AgentCode } from "../types";
import { AgentProviderInterface } from "../interfaces/AgentProviderInterface";

import { Id } from "../../common/identifier";
import { DbModule } from "../../db/DbModule";
import { ConnectionInterface } from "../../db/ConnectionInterface";

@injectable()
export class AgentProvider implements AgentProviderInterface {

  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {}
  
  async getAgent(agentCode: AgentCode, trx?: Transaction): Promise<PaymentAgentDbRow> {
    let query = this.connection.getQueryWithTransaction(trx)
    return await query
      .select()
      .from(Table.PAYMENTS_AGENT)
      .where({
        code: agentCode,
      })
      .first()
  }

  async getAgentById(id: Id, trx?: Transaction): Promise<PaymentAgentDbRow> {
    let query = this.connection.getQueryWithTransaction(trx)
    return await query
      .select()
      .from(Table.PAYMENTS_AGENT)
      .where({ id })
      .first()
  }
  
}
