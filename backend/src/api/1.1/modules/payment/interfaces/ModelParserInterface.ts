import { AgentCode, PaymentEventData, Invoice, Subscription, Coupon } from "../types";
import { AnyDict } from "../../common/types";
import { SubscriptionInOrganizationDbRow } from "../../db/schema";
import { Id } from "../../common/identifier";


export interface ModelParserInterface {
  parseEventData(
    agentCode: AgentCode,
    eventData: AnyDict,
    trx?: Transaction
  ): PromiseLike<PaymentEventData>;
  parseInvoiceEventData(
    invoiceData: AnyDict,
    subscription?: SubscriptionInOrganizationDbRow,
    trx?: Transaction
  ): Promise<Invoice>;
  parseCouponEventData(
    couponData: AnyDict,
    appliedCoupon: AnyDict,
    organizationId: Id,
  ): Coupon;
  parseSubscriptionEventData(
    subscriptionData: AnyDict,
    subscription?: SubscriptionInOrganizationDbRow,
    trx?: Transaction,
  ): Promise<Subscription>;
}
