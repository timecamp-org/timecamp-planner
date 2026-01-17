import {
  CancelOrganizationSubscriptionResult,
  Coupon,
  Invoice,
  PaymentData,
  StartAgentPaymentResult,
  SubscriptionJson,
  UpgradeOrganizationSubscriptionResult,
} from '../types';

import { Id } from '../../common/identifier';
import { AnyDict } from '../../common/types';

export interface PaymentAgentInterface {
  startPayment(paymentData: PaymentData, trx?: Transaction): PromiseLike<StartAgentPaymentResult>;
  upgradeSubscription(
    organizationId: Id,
    subscriptionData: SubscriptionJson
  ): PromiseLike<UpgradeOrganizationSubscriptionResult>;
  cancelSubscription(organizationId: Id): PromiseLike<CancelOrganizationSubscriptionResult>;
  getSubscriptionInvoices(agentSubscriptionId: Id): PromiseLike<Invoice[]>;
  getSubscriptionCoupons(agentSubscriptionId: Id): PromiseLike<Coupon[]>;
  downloadInvoice(agentInvoiceId: Id): PromiseLike<string>;
  getSubscriptionAgentData(organizationId: Id, trx?: Transaction): PromiseLike<AnyDict>;
}
