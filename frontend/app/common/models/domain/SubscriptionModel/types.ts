import { ImmutableMap } from 'common/types';
import { Id } from 'common/utils/identifier';
import { List, Map } from 'immutable';
import { TypedRecord } from 'typed-immutable-record';
import { RequestStatus } from '../RequestModel/types';

export enum InvoiceStatus {
  PAID = 'paid',
  POSTED = 'posted',
  PAYMENT_DUE = 'payment_due',
  NOT_PAID = 'not_paid',
  VOIDED = 'voided',
  PENDING = 'pending',
}

export enum CouponStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

export enum BillingPeriodType {
  BILLING_PERIOD_MONTHLY = 'BILLING_PERIOD_MONTHLY',
  BILLING_PERIOD_YEARLY = 'BILLING_PERIOD_YEARLY',
}

export interface PlanInterface {
  costPerSeat: number;
  billingPeriod: number;
  id: Id;
  isEnabled: boolean;
  name: string;
  planCode: string;
}

export interface PlanRecordInterface extends TypedRecord<PlanRecordInterface>, PlanInterface {}

export interface PlanStaticConfigInterface {
  recommendedAudience: string;
  name?: string;
  hasMultiSeats: boolean;
  features: List<string>;
  featuresAdditional: List<string>;
}

export interface PlanStaticConfigRecordInterface
  extends TypedRecord<PlanStaticConfigRecordInterface>,
    PlanStaticConfigInterface {}

export interface BillingPeriodInterface {
  id: Id;
  numberOfMonths: number;
  label: string;
  subLabel: string;
  pricePer: string;
}

export interface BillingPeriodRecordInterface
  extends TypedRecord<BillingPeriodRecordInterface>,
    BillingPeriodInterface {}

export interface SubscriptionInterface {
  id?: Id;
  planId?: Id;
  nextPlanId?: Id;
  nextBillingAmount?: number;
  seatCount?: number;
  billingPeriod?: number;
  organizationId: Id;
  createdAt: number;
  expiresAt?: number;
  updatedAt?: number;
  status?: SubscriptionStatus;
  agentSubscriptionId?: Id;
}

export interface SubscriptionRecordInterface extends TypedRecord<SubscriptionRecordInterface>, SubscriptionInterface {}

export interface PaymentPageInterface {
  id: Id;
  paymentUrl: string;
  expiresAt: number;
  planCode?: string;
  seatCount: number;
  planId: Id;
  billingPeriodId: Id;
}

export interface PaymentPageRecordInterface extends TypedRecord<PaymentPageRecordInterface>, PaymentPageInterface {}

export interface InvoiceInterface {
  id?: Id;
  agentInvoiceId?: Id;
  subscriptionId?: Id;
  organizationId?: Id;
  total: number;
  amountPaid: number;
  amountAdjusted: number;
  creditsApplied: number;
  quantity: number;
  createdAt: number;
  updatedAt?: number;
  dueDate?: number;
  deleted: boolean;
  status: InvoiceStatus;
}

export interface InvoiceRecordInterface extends TypedRecord<InvoiceRecordInterface>, InvoiceInterface {}

export interface CouponInterface {
  id?: Id;
  status: CouponStatus;
  name?: string;
  validUntil?: Date;
  code?: string;
  organizationId?: Id;
  discountAmount: number;
  discountPercentage: number;
  discountType?: string;
  durationMonth: number;
}

export interface CouponRecordInterface extends TypedRecord<CouponRecordInterface>, CouponInterface {}

export type CountryState = {
  name: string;
};

export type Country = {
  name: string;
  isEu: boolean;
  states?: Record<string, CountryState>;
};

export interface PaymentDataPayload {
  payment: PaymentPageInterface;
  plan: Partial<PlanInterface>;
}

export type ClientFormData = Map<ClientFormField, string>;
export type Plans = Map<Id, PlanRecordInterface>;
export type Invoices = Map<Id, InvoiceInterface>;
export type Coupons = Map<Id, CouponRecordInterface>;
export type ValidationFlags = Map<string, boolean>;

export type SubscriptionData = {
  //TODO
  currentSubscription: SubscriptionInterface;
  plans: List<PlanInterface>;
  invoices: List<InvoiceInterface>;
  coupons: List<CouponInterface>;
};

export interface SubscriptionState extends ImmutableMap<string, any> {
  billingPeriod: BillingPeriodType;
  checkoutFailure: boolean; //TODO
  checkoutStage: CheckoutStage;
  plans: Plans;

  paymentPage: PaymentPageInterface;
  subscriptionData: SubscriptionData;
  validationFlags: ValidationFlags;
  numberOfSeats: number;
  invoices: Invoices;
  isDataUntilCurrentPathValid: boolean;
  organizationSubscriptionCancellation: Map<Id, RequestStatus>;
  planId?: Id;
  clientFormData: ClientFormData;
  currency: string;
  coupons: Coupons;
}

export enum SubscriptionPlanId {
  BASIC = 'heyspace-free',
  PRO_MONTHLY = 'heyspace-premium-monthly',
  PRO_YEARLY = 'heyspace-premium-yearly',
}

export enum SubscriptionCancellationStatus {
  PENDING = 'pending',
  CANCELED = 'canceled',
  COMPLETED = 'completed',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  IN_TRIAL = 'in_trial',
  NON_RENEWING = 'non_renewing',
  CANCELLED = 'cancelled',
  FUTURE = 'future',
}

export enum ClientFormField {
  CITY = 'city',
  COUNTRY = 'country',
  NAME = 'name',
  PROVINCE = 'province',
  STREET = 'street',
  ZIP = 'zip',
}

export enum CheckoutStage {
  STAGE_SUBSCRIPTION_CHOICE = 'STAGE_SUBSCRIPTION_CHOICE',
  STAGE_SUBSCRIPTION_DETAILS = 'STAGE_SUBSCRIPTION_DETAILS',
  STAGE_PAYMENT = 'STAGE_PAYMENT',
  STAGE_CONFIRMATION = 'STAGE_CONFIRMATION',
}
