import { Id } from '../common/identifier';
import { AnyDict } from '../common/types';
import { PaymentDbRow, SubscriptionPlanDbRow, SubscriptionInOrganizationDbRow } from '../db/schema';
import { HttpStatus } from '../../../../infrastructure/enum';

export type PaymentData = {
  organizationId: string
  seatCount: number,
  planId: string,
  billingAddress: BillingAddress,
  customData: AnyDict,
}

export type BillingAddress = {
  email: string,
  firstName: string,
  lastName: string,
  line1: string,
  city: string,
  state: string,
  zip: string,
  country: string,
  company: string,
}

export enum AgentCode {
  CHARGEBEE = 'chargebee'
}

export enum StartPaymentStatus {
  OK,
  ORGANIZATION_NOT_FOUND,
  AGENT_NOT_FOUND,
  PLAN_NOT_FOUND,
  SAVE_PAYMENT_FAILED,
  PAYMENT_AGENT_FAILED,
  USER_LIMIT_EXCEEDED,
  USER_IS_NOT_ORGANIZATION_ADMIN,
  MALFORMED_REQUEST_CONTENT,
}

export enum CreatePaymentStatus {
  OK
}

export enum UpdatePaymentStatus {
  OK
}

export type Payment = {
  url: string,
  expiresAt: Date,
  agentPaymentId: string,
}

export enum SubscriptionStatus {
  STATUS_ACTIVE = 'active',
  STATUS_IN_TRIAL = 'in_trial',
  STATUS_NON_RENEWING = 'non_renewing',
  STATUS_CANCELLED = 'cancelled',
  STATUS_FUTURE = 'future',
}

export type Subscription = {
  id: Id,
  planId: Id,
  nextPlanId: Id,
  seatCount: number,
  organizationId: Id,
  createdAt: Date,
  expiresAt: Date,
  updatedAt: Date,
  status: SubscriptionStatus,
  coupons?: Coupon[],
}

export interface StartPaymentResult {
  status: StartPaymentStatus,
  payment?: PaymentDbRow,
  plan?: SubscriptionPlanDbRow,
  message?: string,
  errorCode?: HttpStatus,
}

export interface StartAgentPaymentResult {
  payment?: Payment,
  errorCode?: HttpStatus,
  message?: string,
}

export interface CreatePaymentResult {
  status: CreatePaymentStatus,
}

export interface UpdatePaymentResult {
  status: UpdatePaymentStatus,
}

export interface PaymentJson {
  id?: Id,
  agentPaymentId?: Id,
  agentId?: Id,
  userId?: Id,
  planId?: Id,
  createdAt?: Date,
  expiresAt: Date,
  seatCount?: number,
  paymentUrl: string,
  organizationId?: Id,
}

export interface PaymentOptions {
  providerOptions: PaymentProviderOptions,
  defaultFreePlanId: Id,
  extraGuestSeats: number,
  freeSubscriptionSeats: number,
  defaultTrialDays: number,
  defaultTrialSeatCount: number,
  isAutoTrialEnabled: boolean,
}

export interface PaymentProviderOptions {
  hookKey: string,
  apiKey: string,
  site?: string,
}

export enum PaymentHookStatus {
  OK,
  INVALID_REQUEST_KEY,
  MALFORMED_REQUEST_CONTENT,
  UNKNOWN_EVENT_TYPE,
  AGENT_OBJECT_NOT_FOUND,
  ORGANIZATION_NOT_FOUND,
  SUBSCRIPTION_NOT_FOUND,
  PAYMENT_CLIENT_ERROR,
  AGENT_NOT_FOUND,
}

export interface PaymentHookResult {
  status: PaymentHookStatus,
  event?: PaymentEventData,
  currentSubscription?: SubscriptionInOrganizationDbRow,
  newSubscription?: SubscriptionInOrganizationDbRow,
}

export interface SubscriptionJson {
  id?: Id,
  agentSubscriptionId?: Id,
  agentId?: Id,
  planId?: Id,
  nextPlanId?: Id,
  seatCount?: number,
  billingPeriod?: number,
  organizationId: Id,
  status?: SubscriptionStatus,
  createdAt?: Date,
  expiresAt?: Date,
  updatedAt?: Date,
  nextBillingAmount?: number,
}


// ***** Subscription features *****

export enum FeatureCode {
  ORGANIZATION_TOTAL_FILES_SIZE = 'total-files-size',
  ORGANIZATION_SINGLE_FILE_SIZE = 'single-file-size',
  EXPORT_BOARD_TO_CSV = 'export-board-to-csv',
  UPDATE_CHECKLIST_ITEM_ASSIGNEES = 'update-checklist-item-assignees',
  OVERWATCH = 'overwatch',
}

export interface SubscriptionFeature {
  isAllowed: boolean,
  value?: any,
  isUnlimited?: boolean
}

export enum SavePlanFeatureStatus {
  OK,
  PLAN_NOT_FOUND,
  PLAN_ALREADY_EXISTS,
}

export interface SavePlanFeatureResult {
  status: SavePlanFeatureStatus
}

export enum SaveSubscriptionFeatureStatus {
  OK,
  SUBSCRIPTION_NOT_FOUND,
  SUBSCRIPTION_ALREADY_EXISTS,
}

export interface SaveSubscriptionFeatureResult {
  status: SaveSubscriptionFeatureStatus,
}

export enum CheckFileIsPermittedToUploadMessage {
  FILE_STORAGE_QUOTA_EXCEEDED = 'Your workspace file storage quota is exceeded. Upgrade your plan to upload more files.',
  SINGLE_FILE_SIZE_EXCEEDED = 'File is too large to upload.',

}

export interface CheckFileIsAllowedToUploadResult {
  isAllowed: boolean,
  message?: CheckFileIsPermittedToUploadMessage,
}

export enum CancelOrganizationSubscriptionStatus {
  OK,
  ORGANIZATION_NOT_FOUND,
  SUBSCRIPTION_NOT_FOUND,
  USER_IS_NOT_ORGANIZATION_OWNER,
}

export interface CancelOrganizationSubscriptionResult {
  status: CancelOrganizationSubscriptionStatus,
  subscription?: SubscriptionInOrganizationDbRow,
}

export enum UpgradeOrganizationSubscriptionStatus {
  OK,
  ORGANIZATION_NOT_FOUND,
  SUBSCRIPTION_NOT_FOUND,
  USER_IS_NOT_ORGANIZATION_OWNER,
  USER_LIMIT_EXCEEDED,
}

export interface UpgradeOrganizationSubscriptionResult {
  status: UpgradeOrganizationSubscriptionStatus
}

export enum InvoiceStatus {
  PAID = 'paid',
  POSTED = 'posted',
  PAYMENT_DUE = 'payment_due',
  NOT_PAID = 'not_paid',
  VOIDED = 'voided',
  PENDING = 'pending'
}

export type Invoice = {
  id: Id,
  agentInvoiceId: Id,
  subscriptionId: Id,
  organizationId: Id,
  total: number,
  amountPaid: number,
  amountAdjusted: number,
  creditsApplied: number,
  createdAt: Date,
  updatedAt: Date,
  dueDate: Date,
  quantity: number,
  status: InvoiceStatus,
  deleted: boolean,
}

export enum CouponStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

export type Coupon = {
  name: string,
  id: string,
  organizationId: Id,
  status: CouponStatus,
  validUntil?: Date,
  code?: string,
  discountAmount: number,
  discountPercentage: number,
  discountType: string,
  durationMonth: number,
}

export interface PaymentEventData {
  type: PaymentEventType,
  agentCode: AgentCode,
  content?: PaymentEventContent,
}
export interface PaymentEventContent {
  subscription?: Subscription,
  invoice?: Invoice,
}

export enum PaymentEventType {
  SUBSCRIPTION = 'subscription',
  INVOICE = 'invoice',
}


export enum OrganizationSubscriptionCancellationStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  REMOVED = 'removed',
}

export enum SetOrganizationSubscriptionCancellationStatus {
  OK,
}

export interface SetOrganizationSubscriptionCancellationResult {
  status: SetOrganizationSubscriptionCancellationStatus,
}

export enum GetSubscriptionViewDataStatus {
  OK, SUBSCRIPTION_NOT_FOUND
}

export interface GetSubscriptionViewDataResult {
  status: GetSubscriptionViewDataStatus,
  plans: SubscriptionPlanDbRow[],
  currentSubscription: SubscriptionInOrganizationDbRow,
  coupons: Coupon[],
}

export const activeSubscriptionStatuses = [SubscriptionStatus.STATUS_ACTIVE, SubscriptionStatus.STATUS_IN_TRIAL, SubscriptionStatus.STATUS_NON_RENEWING]

export enum SubscriptionPlanCode {
  SUBSCRIPTION_TYPE_BASIC = 'heyspace-free',
  SUBSCRIPTION_TYPE_PRO_MONTHLY = 'heyspace-premium-monthly',
  SUBSCRIPTION_TYPE_PRO_YEARLY = 'heyspace-premium-yearly',
}