import { injectable, inject } from "inversify";
import { PaymentProviderInterface } from "../interfaces/PaymentProviderInterface";
import { PaymentDbRow } from "../../db/schema";
import { PaymentJson, AgentCode } from "../types";
import Table from "../../db/Table";
import { Id } from "../../common/identifier";

import { AgentProviderInterface } from "../interfaces/AgentProviderInterface";
import { PaymentModule } from "../PaymentModule";
import { first } from 'lodash'
import { ConnectionInterface } from "../../db/ConnectionInterface";
import { DbModule } from "../../db/DbModule";

@injectable()
export class PaymentProvider implements PaymentProviderInterface {

  private agentProvider: AgentProviderInterface

  constructor(
    @inject(PaymentModule.AgentProviderInterface)
    agentProvider: AgentProviderInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {
    this.agentProvider = agentProvider
  }

  async getPaymentById(paymentId: Id, trx?: Transaction): Promise<PaymentDbRow> {
    let query = this.connection.getQueryWithTransaction(trx)
    return await query
      .select()
      .from(Table.PAYMENTS_PAYMENT)
      .where({ id: paymentId })
      .first()
  }

  async getPaymentByAgentId(agentId: Id, agentPaymentId: string, trx?: Transaction): Promise<PaymentDbRow> {
    let query = this.connection.getQueryWithTransaction(trx)
    return await query
      .select()
      .from(Table.PAYMENTS_PAYMENT)
      .where({ agentId, agentPaymentId })
      .first()
  }

  async getUserPayments(agentCode: AgentCode, userId: Id, organizationId: Id): Promise<PaymentDbRow[]> {
    const agent = await this.agentProvider.getAgent(agentCode)
    return await this.connection.getQueryBuilder()
      .select()
      .from(Table.PAYMENTS_PAYMENT)
      .where({ agentId: agent.id, userId, organizationId })
  }

  async createPayment(payment: PaymentJson, trx?: Transaction): Promise<PaymentDbRow> {
    let connection = trx || this.connection.getConnection()
    const params = {
      table: Table.PAYMENTS_PAYMENT,
      id: connection.raw('?', payment.id),
      agentPaymentId: connection.raw('?', payment.agentPaymentId),
      organizationId: connection.raw('?', payment.organizationId),
      createdAt: connection.raw('?', payment.createdAt),
      expiresAt: connection.raw('?', payment.expiresAt),
      paymentUrl: connection.raw('?', payment.paymentUrl),
      seatCount: connection.raw('?', payment.seatCount),
      agentId: connection.raw('?', payment.agentId),
      planId: connection.raw('?', payment.planId),
      userId: connection.raw('?', payment.userId),
    }
    const result = await connection.raw(
      `INSERT INTO :table: (id, agent_payment_id, organization_id, expires_at, payment_url, seat_count, agent_id, plan_id, user_id) ` +
      `VALUES (:id:, :agentPaymentId:, :organizationId:, :expiresAt:, :paymentUrl:, :seatCount:, :agentId:, :planId:, :userId:) ` +
      `ON CONFLICT (agent_id, agent_payment_id, plan_id, organization_id, user_id) DO UPDATE SET ` +
      `payment_url = :paymentUrl:, agent_id = :agentId:, agent_payment_id = :agentPaymentId:, expires_at = :expiresAt:, seat_count = :seatCount:, created_at = :createdAt:` +
      `returning *`
      ,
      params
    )
    const paymentRow = first<PaymentDbRow>(result.rows)
    if (!paymentRow) {
      return null
    }
    return await this.getPaymentById(paymentRow.id, trx);
  }

  async updatePayment(paymentId: Id, payment: PaymentJson, trx?: Transaction): Promise<PaymentDbRow> {
    let query = this.connection.getQueryWithTransaction(trx)
    return await query
      .from(Table.PAYMENTS_PAYMENT)
      .update(payment)
      .where({ id: paymentId })
      .returning('*')
      .then(first) as PaymentDbRow
  }

}
