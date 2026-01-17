import { List } from 'immutable';
import {
  InvoiceStatus,
  CouponStatus,
  PlanInterface,
  PlanRecordInterface,
  PlanStaticConfigInterface,
  PlanStaticConfigRecordInterface,
  BillingPeriodInterface,
  BillingPeriodRecordInterface,
  SubscriptionInterface,
  SubscriptionRecordInterface,
  PaymentPageInterface,
  PaymentPageRecordInterface,
  InvoiceInterface,
  InvoiceRecordInterface,
  CouponInterface,
  CouponRecordInterface,
} from './types';
import { SubscriptionStatus } from './types';
import { makeTypedFactory } from 'typed-immutable-record';

const defaultPlan: PlanInterface = {
  costPerSeat: 0,
  billingPeriod: 1,
  id: null,
  isEnabled: false,
  name: null,
  planCode: null,
};

export const Plan = makeTypedFactory<PlanInterface | PlanRecordInterface, PlanRecordInterface>(defaultPlan);

const defaultPlanStaticConfig: PlanStaticConfigInterface = {
  name: undefined,
  recommendedAudience: '',
  hasMultiSeats: true,
  features: List(),
  featuresAdditional: List(),
};

// TODO: TO REMOVE AFTER BE PREPARATIONS
export const PlanStaticConfig = makeTypedFactory<
  PlanStaticConfigInterface | PlanStaticConfigRecordInterface,
  PlanStaticConfigRecordInterface
>(defaultPlanStaticConfig);

const defaultBillingPeriod: any = {
  id: null,
  numberOfMonths: 1,
  label: '',
  subLabel: '',
  pricePer: '',
};

// TODO: TO REMOVE AFTER BE PREPARATIONS
export const BillingPeriod = makeTypedFactory<
  BillingPeriodInterface | BillingPeriodRecordInterface,
  BillingPeriodRecordInterface
>(defaultBillingPeriod);

const defaultSubscription: SubscriptionInterface = {
  id: null,
  planId: null,
  nextPlanId: null,
  nextBillingAmount: null,
  seatCount: 0,
  billingPeriod: 1,
  organizationId: null,
  createdAt: null,
  expiresAt: null,
  updatedAt: null,
  status: SubscriptionStatus.IN_TRIAL,
  agentSubscriptionId: null,
};

export const Subscription = makeTypedFactory<
  SubscriptionInterface | SubscriptionRecordInterface,
  SubscriptionRecordInterface
>(defaultSubscription);

const defaultPaymentPage: PaymentPageInterface = {
  id: null,
  paymentUrl: null,
  expiresAt: null,
  seatCount: 1,
  planId: null,
  billingPeriodId: null,
};

export const PaymentPage = makeTypedFactory<
  PaymentPageInterface | PaymentPageRecordInterface,
  PaymentPageRecordInterface
>(defaultPaymentPage);

const defaultInvoice: InvoiceInterface = {
  id: undefined,
  agentInvoiceId: undefined,
  subscriptionId: undefined,
  organizationId: undefined,
  total: 0,
  amountPaid: 0,
  amountAdjusted: 0,
  creditsApplied: 0,
  quantity: 0,
  createdAt: undefined,
  updatedAt: undefined,
  dueDate: undefined,
  deleted: false,
  status: InvoiceStatus.PENDING,
};

export const Invoice = makeTypedFactory<InvoiceInterface | InvoiceRecordInterface, InvoiceRecordInterface>(
  defaultInvoice
);

const defaultCoupon: CouponInterface = {
  id: undefined,
  status: CouponStatus.ACTIVE,
  name: undefined,
  validUntil: undefined,
  code: undefined,
  organizationId: undefined,
  discountAmount: 0,
  discountPercentage: 0,
  discountType: undefined,
  durationMonth: 0,
};

export const Coupon = makeTypedFactory<CouponInterface | CouponRecordInterface, CouponRecordInterface>(defaultCoupon);
