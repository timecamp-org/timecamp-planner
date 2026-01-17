import { AgentCode, PaymentEventData, Invoice, Subscription, InvoiceStatus, Coupon, CouponStatus } from "../types";
import { AnyDict } from "../../common/types";
import { ChargebeeInvoice, ChargebeeSubscription, ChargebeeInvoiceLineItem, ChargebeeCoupon, ChargebeeAppliedCoupon } from "./types";
import { injectable } from "inversify";
import { SubscriptionProviderInterface } from "../interfaces/SubscriptionProviderInterface";
import { TimeServiceInterface } from "../../common/time/TimeServiceInterface";
import { ChargebeePaymentAgent } from "./ChargebeePaymentAgent";
import { LoggerInterface } from "../../../../../infrastructure/logger";
import { SubscriptionInOrganizationDbRow } from "../../db/schema";
import { ModelParserInterface } from "../interfaces/ModelParserInterface";
import { Id } from "../../common/identifier";


@injectable()
export class ChargebeeModelParser implements ModelParserInterface {
  private subscriptionProvider: SubscriptionProviderInterface;
  private timeService: TimeServiceInterface;
  private logger: LoggerInterface;

  constructor(
    subscriptionProvider: SubscriptionProviderInterface,
    timeService: TimeServiceInterface,
    logger: LoggerInterface,
  ) {
    this.subscriptionProvider = subscriptionProvider;
    this.timeService = timeService;
    this.logger = logger
  }
  async parseEventData(
    agentCode: AgentCode,
    eventData: AnyDict,
    trx: Transaction
  ): Promise<PaymentEventData> {
    try {
      const invoice: ChargebeeInvoice = eventData.content.invoice
      const subscription: ChargebeeSubscription = eventData.content.subscription

      const result: PaymentEventData = {
        agentCode,
        type: eventData.event_type,
        content: {},
      }

      if (invoice) {
        result.content.invoice = await this.parseInvoiceEventData(invoice, null, trx);
      }

      if (subscription) {
        result.content.subscription = await this.parseSubscriptionEventData(subscription, null, trx)
      }
      return result
    } catch (error) {
      this.logger.error(error)
    }
  }

  async parseInvoiceEventData(
    cbInvoice: ChargebeeInvoice,
    subscription?: SubscriptionInOrganizationDbRow,
    trx?: Transaction,
  ): Promise<Invoice> {
    if (!subscription) {
      subscription = await this.subscriptionProvider.getSubscriptionByAgentSubscriptionId(cbInvoice.subscription_id, trx);
    }
    const planLineItem = this.getPlanInvoiceLineItem(cbInvoice.line_items);
    return {
      createdAt: this.timeService.getTimeFromSeconds(cbInvoice.date),
      agentInvoiceId: cbInvoice.id,
      amountAdjusted: cbInvoice.amount_adjusted,
      amountPaid: cbInvoice.amount_paid,
      creditsApplied: cbInvoice.credits_applied,
      deleted: cbInvoice.deleted,
      dueDate: this.timeService.getTimeFromSeconds(cbInvoice.due_date),
      id: cbInvoice.id,
      organizationId: subscription ? subscription.organizationId : null,
      status: cbInvoice.status as InvoiceStatus,
      subscriptionId: cbInvoice.subscription_id,
      total: cbInvoice.total,
      updatedAt: this.timeService.getTimeFromSeconds(cbInvoice.updated_at),
      quantity: planLineItem ? planLineItem.quantity : null,
    }
  }

  parseCouponEventData(
    cbCoupon: ChargebeeCoupon,
    appliedCoupon: ChargebeeAppliedCoupon,
    organizationId: Id,
  ): Coupon {
    return {
      id: cbCoupon.id,
      name: cbCoupon.name,
      code: appliedCoupon.coupon_code,
      validUntil: this.timeService.getTimeFromSeconds(cbCoupon.valid_till),
      organizationId: organizationId,
      status: cbCoupon.status as CouponStatus,
      discountAmount: cbCoupon.discount_amount,
      discountPercentage: cbCoupon.discount_percentage,
      discountType: cbCoupon.discount_type,
      durationMonth: cbCoupon.duration_month,
    }
  }

  async parseSubscriptionEventData(
    cbSubscription: ChargebeeSubscription,
    subscription?: SubscriptionInOrganizationDbRow,
    trx?: Transaction
  ): Promise<Subscription> {
    if (!subscription) {
      subscription = await this.subscriptionProvider.getSubscriptionByAgentSubscriptionId(cbSubscription.id, trx);
    }
    return {
      createdAt: this.timeService.getTimeFromSeconds(cbSubscription.created_at),
      expiresAt: this.timeService.getTimeFromSeconds(cbSubscription.current_term_end),
      id: cbSubscription.id,
      nextPlanId: subscription ? subscription.nextPlanId : null,
      organizationId: cbSubscription.cf_organization_id,
      planId: cbSubscription.plan_id,
      seatCount: cbSubscription.plan_quantity,
      status: ChargebeePaymentAgent.getSubscriptionStatus(cbSubscription.status),
      updatedAt: this.timeService.getTimeFromSeconds(cbSubscription.updated_at),
    }
  }

  private getPlanInvoiceLineItem(lineItems: ChargebeeInvoiceLineItem[]): ChargebeeInvoiceLineItem {
    return lineItems.find(item => item.entity_type === 'plan')
  }
}
