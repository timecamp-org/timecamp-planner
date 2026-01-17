import { action } from 'typesafe-actions';

import * as C from './constants';
import { Subscription, Plan, Invoice } from 'models/domain/SubscriptionModel/models';
import { Map } from 'immutable';
import { Coupon } from './models';
import {
  CheckoutStage,
  CouponInterface,
  InvoiceInterface,
  PaymentPageInterface,
  PlanInterface,
  SubscriptionInterface,
  SubscriptionRecordInterface,
} from './types';
import { Id } from 'common/utils/identifier';
import { ActionResult } from '../ActionResultModel';
import { deserializeSubscription } from './deserializers/deserializeSubscription';
import { deserializePlan } from './deserializers/deserializePlan';

const emptyMap = Map();

export const onInit = () => action(C.onInit, undefined, { isBatchDisabled: true });

export const onCheckoutStageCheck = () => action(C.onCheckoutStageCheck);

export const onCheckoutStageCheckSuccess = () => action(C.onCheckoutStageCheckSuccess);

export const onCheckoutStageCheckFailure = (error: string) => action(C.onCheckoutStageCheckFailure, { error });

export const onSetCheckoutStage = (checkoutStage: CheckoutStage) => action(C.onSetCheckoutStage, { checkoutStage });

export const onFetchPaymentPage = () => action(C.onFetchPaymentPage);

export const onRemovePersistPaymentPage = () => action(C.onRemovePersistPaymentPage);

export const onSetPaymentPage = (paymentPage: PaymentPageInterface) => action(C.onSetPaymentPage, { paymentPage });

export const onClientShouldBeValidated = () => action(C.onClientShouldBeValidated);

export const onAdvanceFromSubscriptionChoice = (planId: Id) => action(C.onAdvanceFromSubscriptionChoice, { planId });

export const onAdvanceFromSubscriptionDetails = () => action(C.onAdvanceFromSubscriptionDetails);

export const onSeatsNumberUpdate = (numberOfSeats: number) => action(C.onSeatsNumberUpdate, { numberOfSeats });

export const onChooseBillingPeriod = (billingPeriodId: Id) => action(C.onChooseBillingPeriod, { billingPeriodId });

export const onSelectPlan = (planId: Id) => action(C.onSelectPlan, { planId });

export const onClientNameUpdate = (name: string) => action(C.onClientNameUpdate, { name });

export const onClientStreetUpdate = (street: string) => action(C.onClientStreetUpdate, { street });

export const onClientCityUpdate = (city: string) => action(C.onClientCityUpdate, { city });

export const onClientZipUpdate = (zip: string) => action(C.onClientZipUpdate, { zip });

export const onClientProvinceUpdate = (province: string) => action(C.onClientProvinceUpdate, { province });

export const onClientCountryUpdate = (country: string) => action(C.onClientCountryUpdate, { country });

export const onPaymentSuccess = () => action(C.onPaymentSuccess);

export const onCreateSubscriptionData = (subscription: SubscriptionInterface) =>
  action(
    C.onCreateSubscriptionData,
    { subscription: Subscription(deserializeSubscription(subscription)) },
    { isBatchDisabled: true }
  );

export const onUpdateSubscriptionData = (subscription: SubscriptionInterface) =>
  action(C.onUpdateSubscriptionData, { subscription: Subscription(deserializeSubscription(subscription)) });

export const onRemoveSubscriptionData = (subscriptionId: Id, organizationId: Id) =>
  action(C.onRemoveSubscriptionData, {
    subscriptionId,
    organizationId,
  });

export const onCreatePlanData = (plan: PlanInterface) =>
  action(C.onCreatePlanData, { plan: Plan(deserializePlan(plan)) });

export const onUpdatePlanData = (plan: PlanInterface) =>
  action(C.onUpdatePlanData, { plan: Plan(deserializePlan(plan)) });

export const onRemovePlanData = (planId: Id) => action(C.onRemovePlanData, { planId });

export const onCreateInvoiceData = (invoice: InvoiceInterface) =>
  action(C.onCreateInvoiceData, { invoice: Invoice(invoice) });

export const onUpdateInvoiceData = (invoice: InvoiceInterface) =>
  action(C.onUpdateInvoiceData, { invoice: Invoice(invoice) });

export const onRemoveInvoiceData = (invoiceId: Id) => action(C.onRemoveInvoiceData, { invoiceId });

export const onBatchSubscriptionData = (subscriptions: SubscriptionInterface[]) => {
  let subscriptionData = emptyMap as Map<Id, SubscriptionRecordInterface>;

  subscriptions.forEach((subscription) => {
    subscriptionData = subscriptionData.set(subscription.organizationId, Subscription(subscription));
  });

  return action(C.onBatchSubscriptionData, { subscriptionData });
};

export const onFinishCheckout = () => action(C.onFinishCheckout);

export const onFinishCheckoutSuccess = () => action(C.onFinishCheckoutSuccess);

export const onFinishCheckoutFailure = () => action(C.onFinishCheckoutFailure);

export const onCancelOrganizationSubscription = (organizationId: Id) =>
  action(C.onCancelOrganizationSubscription, { organizationId });

export const onSetSubscriptionCancellationStatus = (organizationId: Id, status: any) =>
  action(C.onSetSubscriptionCancellationStatus, {
    organizationId,
    status,
  });

export const onRemoveSubscriptionCancellationStatus = (organizationId: Id) =>
  action(C.onRemoveSubscriptionCancellationStatus, { organizationId });

export const onFetchSubscriptionData = () =>
  action(C.onFetchSubscriptionData, undefined, {
    isBatchDisabled: true,
  });

export const onFetchSubscriptionDataSuccess = (actionResult: ActionResult) =>
  action(C.onFetchSubscriptionDataSuccess, actionResult, { isBatchDisabled: true });

export const onFetchSubscriptionDataFailure = (actionResult: ActionResult) =>
  action(C.onFetchSubscriptionDataFailure, actionResult, { isBatchDisabled: true });

export const onFetchSubscriptionInvoices = () => action(C.onFetchSubscriptionInvoices);

export const onFetchSubscriptionInvoicesSuccess = (actionResult: ActionResult) =>
  action(C.onFetchSubscriptionInvoicesSuccess, actionResult);

export const onFetchSubscriptionInvoicesFailure = (actionResult: ActionResult) =>
  action(C.onFetchSubscriptionInvoicesFailure, actionResult);

export const onUpdateSubscription = (subscriptionData: SubscriptionInterface) =>
  action(C.onUpdateSubscription, { subscriptionData });

export const onUpdateCustomSubscription = (subscriptionData: SubscriptionInterface) =>
  action(C.onUpdateCustomSubscription, { subscriptionData });

export const onDownloadInvoice = (invoiceId: Id) => action(C.onDownloadInvoice, { invoiceId });

export const onFetchUserOrganizationSubscriptions = () => action(C.onFetchUserOrganizationSubscriptions);

export const onUpdateSubscriptionCouponsData = (entity: CouponInterface[]) => {
  let coupons = emptyMap;
  entity.forEach((coupon) => {
    coupons = coupons.set(coupon.id, Coupon(coupon));
  });

  return action(C.onUpdateSubscriptionCouponsData, { coupons });
};
