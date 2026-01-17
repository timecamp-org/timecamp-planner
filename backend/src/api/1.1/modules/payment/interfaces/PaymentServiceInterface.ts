import {
  PaymentData,
  AgentCode,
  StartPaymentResult,
  PaymentHookResult,
  UpgradeOrganizationSubscriptionResult,
  SubscriptionJson,
  Invoice,
  PaymentEventData,
  CancelOrganizationSubscriptionResult,
  Coupon,
} from '../types'
import { Id } from "../../common/identifier";
import { Request } from "express";
import { EventDelegate } from '../../../../../utils/EventDelegate';

export interface PaymentServiceInterface {
  paymentEvent: EventDelegate<PaymentEventData>;

  startPayment(agentCode: AgentCode, paymentData: PaymentData, userId: Id): PromiseLike<StartPaymentResult>;

  handlePaymentEvent(request: Request): PromiseLike<PaymentHookResult>;

  cancelOrganizationSubscription(agentCode: AgentCode, organizationId: Id, userId: Id): Promise<CancelOrganizationSubscriptionResult>;

  upgradeOrganizationSubscription(agentCode: AgentCode, organizationId: Id, subscriptionData: SubscriptionJson): PromiseLike<UpgradeOrganizationSubscriptionResult>;

  getSubscriptionInvoices(agentCode: AgentCode, agentSubscriptionId: Id): PromiseLike<Invoice[]>;
  
  getSubscriptionCoupons(agentCode: AgentCode, agentSubscriptionId: Id): PromiseLike<Coupon[]>;
}
