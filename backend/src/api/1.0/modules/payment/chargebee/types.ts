import { Id } from '../../common/identifier';

export enum ChargebeeEventType {
  EVENT_SUBSCRIPTION_CREATED = 'subscription_created',
  EVENT_SUBSCRIPTION_CANCELLATION_SCHEDULED = 'subscription_cancellation_scheduled',
  EVENT_SUBSCRIPTION_SCHEDULED_CANCELLATION_REMOVED = 'subscription_scheduled_cancellation_removed',
  EVENT_SUBSCRIPTION_CHANGED = 'subscription_changed',
  EVENT_SUBSCRIPTION_CANCELLED = 'subscription_cancelled',
  EVENT_SUBSCRIPTION_STARTED = 'subscription_started',
  EVENT_SUBSCRIPTION_ACTIVATED = 'subscription_activated',
  EVENT_SUBSCRIPTION_RENEWED = 'subscription_renewed',
  EVENT_SUBSCRIPTION_REACTIVATED = 'subscription_reactivated',
  EVENT_SUBSCRIPTION_DELETED = 'subscription_deleted',
  EVENT_SUBSCRIPTION_PAUSED = 'subscription_paused',
  EVENT_SUBSCRIPTION_PAUSE_SCHEDULED = 'subscription_pause_scheduled',
  EVENT_SUBSCRIPTION_SCHEDULED_PAUSE_REMOVED = 'subscription_scheduled_pause_removed',
  EVENT_SUBSCRIPTION_RESUMED = 'subscription_resumed',
  EVENT_SUBSCRIPTION_RESUMPTION_SCHEDULED = 'subscription_resumption_scheduled',
  EVENT_SUBSCRIPTION_SCHEDULED_RESUMPTION_REMOVED = 'subscription_scheduled_resumption_removed',
  EVENT_INVOICE_GENERATED = 'invoice_generated',
  EVENT_INVOICE_UPDATED = 'invoice_updated',
  EVENT_INVOICE_DELETED = 'invoice_deleted',
}

export enum ChargebeeSubscriptionStatus {
  STATUS_ACTIVE = 'active',
  STATUS_IN_TRIAL = 'in_trial',
  STATUS_NON_RENEWING = 'non_renewing',
  STATUS_CANCELLED = 'cancelled',
  STATUS_FUTURE = 'future',
}

export interface ChargebeeConfig {
  key: string;
  site: string;
  hookKey: string;
}

export type ChargebeeRequestPayload = {
  subscription: ChargebeeSubscriptionPayload;
  customer?: ChargebeeCustomerPayload;
  billing_address?: ChargebeeBillingAddressPayload;
  custom_field: string;
  embed: boolean;
  iframe_messaging: boolean;
};

export type ChargebeeSubscriptionPayload = {
  plan_id: string;
  status?: any;
  plan_quantity: number;
  cf_organization_id: Id;
  plan_unit_price?: number | string;
};

export type ChargebeeCustomerPayload = {
  email: string;
  first_name: string;
  last_name: string;
  locale?: string;
  company: string;
};

export type ChargebeeBillingAddressPayload = {
  email: string;
  first_name: string;
  last_name: string;
  line1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  company: string;
};

export type ChargebeeSubscription = {
  id: string;
  customer_id: string;
  plan_id: string;
  plan_quantity: number;
  plan_unit_price: number | string;
  plan_amount: number;
  billing_period: number;
  billing_period_unit: string;
  plan_free_quantity: number;
  status: ChargebeeSubscriptionStatus;
  trial_start: number;
  trial_end: number;
  current_term_start: number;
  current_term_end: number;
  next_billing_at: number;
  created_at: number;
  started_at: number;
  activated_at: number;
  updated_at: number;
  cancelled_at: number;
  has_scheduled_changes: boolean;
  resource_version: number;
  deleted: boolean;
  object: string;
  currency_code: string;
  due_invoices_count: number;
  due_since: number;
  total_dues: number;
  mrr: number;
  exchange_rate: number;
  base_currency_code: string;
  cf_organization_id: Id;
  remaining_billing_cycles: number;
  coupons?: ChargebeeAppliedCoupon[];
  cancel_reason?: CancelReason;
};

export type ChargebeeCustomer = {
  id: string;
  email: string;
  auto_collection: string;
  net_term_days: number;
  allow_direct_debit: boolean;
  created_at: number;
  taxability: string;
  updated_at: number;
  pii_cleared: string;
  resource_version: number;
  deleted: boolean;
  object: string;
  card_status: string;
};

export type ChargebeeInvoice = {
  id: string;
  customer_id: string;
  subscription_id: string;
  recurring: boolean;
  status: string;
  price_type: string;
  date: number;
  due_date: number;
  net_term_days: number;
  exchange_rate: number;
  total: number;
  amount_paid: number;
  amount_adjusted: number;
  write_off_amount: number;
  credits_applied: number;
  amount_due: number;
  paid_at: number;
  updated_at: number;
  resource_version: number;
  deleted: boolean;
  object: string;
  first_invoice: boolean;
  amount_to_collect: number;
  round_off_amount: number;
  has_advance_charges: boolean;
  currency_code: string;
  base_currency_code: string;
  tax: number;
  line_items: ChargebeeInvoiceLineItem[];
};

export type ChargebeeAppliedCoupon = {
  coupon_id: string;
  apply_till: number;
  applied_count: number;
  coupon_code: string;
};

export type ChargebeeCoupon = {
  addon_constraint: string;
  apply_discount_on: string;
  apply_on: string;
  created_at: number;
  currency_code: string;
  discount_amount: number;
  discount_percentage: number;
  discount_type: string;
  duration_type: string;
  duration_month: number;
  id: string;
  name: string;
  object: string;
  plan_constraint: string;
  redemptions: number;
  resource_version: number;
  status: string;
  updated_at: number;
  valid_till: number;
};

export type ChargebeeInvoiceLineItem = {
  id: string;
  date_from: number;
  date_to: number;
  unit_amount: number;
  quantity: number;
  amount: number;
  pricing_model: string;
  is_taxed: boolean;
  tax_amount: number;
  object: string;
  subscription_id: string;
  description: string;
  entity_type: string;
  entity_id: string;
  tax_exempt_reason: string;
  discount_amount: number;
  item_level_discount_amount: number;
};

export type ChargebeeHostedPage = {
  id: string;
  type: string;
  url: string;
  state: string;
  embed: boolean;
  created_at: number;
  expires_at: number;
  object: string;
  updated_at: number;
  resource_version: number;
};

export type ChargebeeEvent = {
  id: string;
  content: ChargebeeEventContent;
  event_type: ChargebeeEventType;
  webhook_status: string; // enum
};

export type ChargebeeEventContent = {
  subscription: ChargebeeSubscription;
  customer: ChargebeeCustomer;
  invoice: ChargebeeInvoice;
};

export type InvoiceEstimate = {
  amount_due: number;
  amount_paid: number;
  credits_applied: number;
  currency_code: string;
  object: string;
  price_type: string;
  recurring: boolean;
  round_off_amount: number;
  sub_total: number;
  total: number;
};

export type SubscriptionEstimate = {
  currency_code: string;
  id: string;
  next_billing_at: number;
  object: string;
  status: string;
};

export type SubscriptionRenewalEstimate = {
  invoice_estimate: InvoiceEstimate;
  subscription_estimate: SubscriptionEstimate;
};

export enum CancelReason {
  NOT_PAID = 'not_paid',
  NO_CARD = 'not_card',
  FRAUD_REVIEW = 'fraud_review',
  NON_COMPLIANT_EU_CUSTOMER = 'non_compliant_eu_customer',
  TAX_CALCULATION_FAILED = 'tax_calculation_failed',
  CURRENCY_INCOMPATIBILE_WITH_GATEWAY = 'currency_incompatible_with_gateway',
  NON_COMPLIANT_CUSTOMER = 'non_compliant_customer',
}
