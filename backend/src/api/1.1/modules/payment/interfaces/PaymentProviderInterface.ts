import { PaymentDbRow } from "../../db/schema";
import { Id } from "../../common/identifier";
import { PaymentJson, AgentCode } from "../types";


export interface PaymentProviderInterface {
  getPaymentById(paymentId: Id, trx?: Transaction): PromiseLike<PaymentDbRow>;

  getPaymentByAgentId(agentId: Id, agentPaymentId: string, trx?: Transaction): PromiseLike<PaymentDbRow>;

  getUserPayments(agentCode: AgentCode, userId: Id, organizationId: Id): Promise<PaymentDbRow[]>;

  createPayment(payment: PaymentJson, trx?: Transaction): PromiseLike<PaymentDbRow>;

  updatePayment(paymentId: Id, payment: PaymentJson, trx?: Transaction): PromiseLike<PaymentDbRow>;
}
