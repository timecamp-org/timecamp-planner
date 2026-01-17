import { UserTracker, HeySpaceClient as client, localStorage } from 'common/services';
import { PartialPayloadAction } from 'common/types';
import { Id } from 'common/utils/identifier';
import { List, Map } from 'immutable';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { call, cps, fork, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import handleError from '../../../utils/handleError';
import makeActionResult from '../../../utils/makeActionResult';
import * as PopUpAlertsModelActions from '../../component/PopUpAlertsModel/actions';
import { UserTrackerEvent } from '../../component/UserTrackerEventModel/constants';
import { selectCurrentOrganizationOccupiedGuestSeatsCount } from '../GuestsModel/selectors';
import { HumanMessage } from '../HumanMessageModel/models';
import { HumanMessageKind } from '../HumanMessageModel/types';
import { selectCurrentOrganizationMemberUserIds } from '../OrganizationsModel/selectors';
import { selectCurrentOrganizationId } from '../OrganizationsModel/selectors/domain';
import { onSetRequestStatus } from '../RequestModel/actions';
import * as RequestTypesConstants from '../RequestModel/constants/requestTypes';
import { RequestStatus, ResponseCode } from '../RequestModel/types';
import { ADDITIONAL_GUEST_SEATS } from '../SubscriptionLimitsModel/constants';
import { selectUsersPerWorkspaceLimit } from '../SubscriptionLimitsModel/selectors';
import { User } from '../UsersModel/models';
import * as UsersModelSelectors from '../UsersModel/selectors/domain';
import * as A from './actions';
import * as C from './constants';
import * as humanMessages from './constants/humanMessages';

import { deserializePlan } from './deserializers/deserializePlan';
import { deserializeSubscription } from './deserializers/deserializeSubscription';
import { Coupon, Invoice, PaymentPage, Plan } from './models';
import {
  selectCurrentSubscriptionPlanCode,
  selectCurrentSubscriptionPlanId,
  selectCurrentSubscriptionSeatCount,
  selectIsCurrentSubscriptionLifetime,
  selectIsCurrentSubscriptionTrial,
  selectIsBillingEnabled,
} from './selectors';
import {
  selectBillingPeriodId,
  selectCheckoutStage,
  selectChosenPlanCode,
  selectClientFormData,
  selectFirstPremiumPlanId,
  selectFreePlanId,
  selectIsChosenSubscriptionFree,
  selectIsClientFormDataValid,
  selectIsDataUntilCurrentPathValid,
  selectIsPlanFree,
  selectNumberOfSeats,
  selectPlanCode,
  selectSubscriptionPlan,
  selectSubscriptionPlanId,
} from './selectors/domain';
import {
  BillingPeriodType,
  CheckoutStage,
  ClientFormData,
  ClientFormField,
  CouponInterface,
  InvoiceInterface,
  PaymentDataPayload,
  PaymentPageInterface,
  PaymentPageRecordInterface,
  PlanInterface,
  SubscriptionCancellationStatus,
  SubscriptionData,
  SubscriptionInterface,
  SubscriptionPlanId,
} from './types';
import validatePaymentPage from './utils/validatePaymentPage';

const emptyMap = Map();

export default [
  function* () {
    yield fork(function* () {
      yield takeLatest(C.onInit, onInit); // eslint-disable-line
    });
    yield fork(function* () {
      yield takeEvery(C.onCheckoutStageCheck, onCheckoutStageCheck);
    });
    yield fork(function* () {
      yield takeEvery(C.onAdvanceFromSubscriptionChoice, onAdvanceFromSubscriptionChoice);
    });
    yield fork(function* () {
      yield takeEvery(C.onAdvanceFromSubscriptionDetails, onAdvanceFromSubscriptionDetails);
    });
    yield fork(function* () {
      yield takeEvery(C.onFinishCheckout, onFinishCheckout);
    });
    yield fork(function* () {
      yield takeEvery(C.onCancelOrganizationSubscription, onCancelOrganizationSubscription);
    });
    yield fork(function* () {
      yield takeEvery(C.onUpdateSubscription, onUpdateSubscription);
    });
    yield fork(function* () {
      yield takeEvery(C.onUpdateCustomSubscription, onUpdateCustomSubscription);
    });

    yield fork(function* () {
      yield takeEvery(C.onDownloadInvoice, onDownloadInvoice);
    });
    yield fork(function* () {
      yield takeEvery(C.onFetchSubscriptionData, onFetchSubscriptionData);
    });
    yield fork(function* () {
      yield takeEvery(C.onFetchSubscriptionInvoices, onFetchSubscriptionInvoices);
    });
    yield fork(function* () {
      yield takeEvery(C.onFetchPaymentPage, onFetchPaymentPage);
    });
    yield fork(function* () {
      yield takeEvery(C.onRemovePersistPaymentPage, onRemovePersistPaymentPage);
    });
    yield fork(function* () {
      yield takeEvery(C.onPaymentSuccess, onPaymentSuccess);
    });
    yield fork(function* () {
      yield takeEvery(C.onFetchUserOrganizationSubscriptions, onFetchUserOrganizationSubscriptions);
    });
  },
];

export function* onInit() {
  try {
    yield call(onFetchSubscriptionData);
  } catch (error) {
    handleError(error);
  }
}

export function* onFetchSubscriptionData() {
  const currentOrganizationId: Id = yield select(selectCurrentOrganizationId);
  try {
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.getSubscriptionViewData,
        currentOrganizationId,
        RequestStatus.LOADING,
        null,
        null,
        null,
        true,
      ),
    );
    const subscriptionData: SubscriptionData = yield cps(
      client.restApiClient.getSubscriptionViewData,
      'chargebee',
      currentOrganizationId,
    );

    if (!subscriptionData) {
      throw new Error('Subscription data not fetched');
    }

    let subscriptionPlans = emptyMap as Map<Id, PlanInterface>;
    let invoices = emptyMap as Map<Id, InvoiceInterface>;
    let coupons = emptyMap as Map<Id, CouponInterface>;

    if (!isEmpty(subscriptionData.currentSubscription)) {
      yield put(A.onCreateSubscriptionData(deserializeSubscription(subscriptionData.currentSubscription)));
    }

    if (!isEmpty(subscriptionData.plans)) {
      subscriptionData.plans.forEach((plan: PlanInterface) => {
        subscriptionPlans = subscriptionPlans.set(plan.id, Plan(deserializePlan(plan)));
      });
    }

    if (!isEmpty(subscriptionData.invoices)) {
      subscriptionData.invoices.forEach((invoice: InvoiceInterface) => {
        invoices = invoices.set(invoice.id, Invoice(invoice));
      });
    }

    if (!isEmpty(subscriptionData.coupons)) {
      subscriptionData.coupons.forEach((coupon: CouponInterface) => {
        coupons = coupons.set(coupon.id, Coupon(coupon));
      });
    }

    yield put(
      A.onFetchSubscriptionDataSuccess(
        makeActionResult({
          isOk: true,
          code: 'onFetchSubscriptionDataSuccess',
          data: { subscriptionPlans, invoices, coupons },
        }),
      ),
    );

    const freePlanId = yield select(selectFreePlanId);

    console.log('[TEST]', { freePlanId, cs: subscriptionData.currentSubscription });

    yield put(
      onSetRequestStatus(
        RequestTypesConstants.getSubscriptionViewData,
        currentOrganizationId,
        RequestStatus.SUCCESS,
        null,
        null,
        null,
        true,
      ),
    );
  } catch (error) {
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.getSubscriptionViewData,
        currentOrganizationId,
        RequestStatus.FAILURE,
        error,
        null,
        true,
        true,
      ),
    );
    handleError(error);
  }
}

export function* onFetchUserOrganizationSubscriptions() {
  const currentUserId: Id = yield select(UsersModelSelectors.selectCurrentUserId);
  try {
    yield put(
      onSetRequestStatus(RequestTypesConstants.getUserOrganizationSubscriptions, currentUserId, RequestStatus.LOADING),
    );

    const subscriptions: SubscriptionInterface[] = yield cps(client.restApiClient.getUserOrganizationSubscriptions);
    if (subscriptions.length > 0) {
      yield put(A.onBatchSubscriptionData(subscriptions.map(deserializeSubscription)));
    }
    yield put(
      onSetRequestStatus(RequestTypesConstants.getUserOrganizationSubscriptions, currentUserId, RequestStatus.SUCCESS),
    );
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.getUserOrganizationSubscriptions,
        currentUserId,
        RequestStatus.FAILURE,
        error,
      ),
    );
  }
}

export function* onFetchSubscriptionInvoices() {
  const currentOrganizationId: Id = yield select(selectCurrentOrganizationId);
  const isBillingEnabled: boolean = yield select(selectIsBillingEnabled);
  if (!isBillingEnabled) {
    return;
  }
  try {
    yield put(
      onSetRequestStatus(RequestTypesConstants.getSubscriptionInvoices, currentOrganizationId, RequestStatus.LOADING),
    );
    const result = yield cps(client.restApiClient.getSubscriptionInvoices, 'chargebee', currentOrganizationId);

    let invoices = emptyMap as Map<Id, InvoiceInterface>;

    if (!isEmpty(result)) {
      result.forEach((invoice: InvoiceInterface) => {
        invoices = invoices.set(invoice.id, Invoice(invoice));
      });
    }

    yield put(
      A.onFetchSubscriptionInvoicesSuccess(
        makeActionResult({
          isOk: true,
          code: 'onFetchSubscriptionInvoicesSuccess',
          data: { invoices },
        }),
      ),
    );
    yield put(
      onSetRequestStatus(RequestTypesConstants.getSubscriptionInvoices, currentOrganizationId, RequestStatus.SUCCESS),
    );
  } catch (error) {
    console.log(error);
    if (error.params.body.code === ResponseCode.RESOURCE_NOT_FOUND) {
      // that's ok
      yield put(
        onSetRequestStatus(RequestTypesConstants.getSubscriptionInvoices, currentOrganizationId, RequestStatus.FAILURE),
      );
    } else {
      handleError(error);
      yield put(
        onSetRequestStatus(
          RequestTypesConstants.getSubscriptionInvoices,
          currentOrganizationId,
          RequestStatus.FAILURE,
          error,
        ),
      );
    }
  }
}

export function* onCheckoutStageCheck() {
  try {
    const checkoutStage: CheckoutStage = yield select(selectCheckoutStage);
    const subscriptionPlan: PlanInterface = yield select(selectSubscriptionPlan);

    const isClientFormDataValid: boolean = yield select(selectIsClientFormDataValid);
    const isDataUntilCurrentPathValid: boolean = yield select(selectIsDataUntilCurrentPathValid);
    const isSubscriptionFree: boolean = yield select(selectIsChosenSubscriptionFree);
    const paymentPage: PaymentPageInterface = yield call(getPersistPaymentPage);

    switch (checkoutStage) {
      case CheckoutStage.STAGE_SUBSCRIPTION_CHOICE: {
        if (paymentPage) {
          yield put(A.onSeatsNumberUpdate(paymentPage.seatCount));
          yield put(A.onSelectPlan(paymentPage.planId));
          yield put(A.onChooseBillingPeriod(paymentPage.billingPeriodId));
          yield put(A.onSetCheckoutStage(CheckoutStage.STAGE_PAYMENT));
        }
        break;
      }
      case CheckoutStage.STAGE_SUBSCRIPTION_DETAILS: {
        if (!subscriptionPlan) {
          const error = 'Subscription not chosen';
          handleError(error);
          yield put(A.onCheckoutStageCheckFailure(error));
          yield put(A.onSetCheckoutStage(CheckoutStage.STAGE_SUBSCRIPTION_CHOICE));
          return;
        }
        break;
      }
      case CheckoutStage.STAGE_PAYMENT: {
        if (!(subscriptionPlan && (isClientFormDataValid || isSubscriptionFree || paymentPage))) {
          const error = 'Subscription not chosen or client form data is not valid';
          handleError(error, {
            subscriptionPlan,
            isClientFormDataValid,
            isSubscriptionFree,
            paymentPage,
          });
          yield put(A.onCheckoutStageCheckFailure(error));
          yield put(A.onSetCheckoutStage(CheckoutStage.STAGE_SUBSCRIPTION_DETAILS));
          return;
        }
        break;
      }
      case CheckoutStage.STAGE_CONFIRMATION: {
        if (!(subscriptionPlan && (isClientFormDataValid || isSubscriptionFree || paymentPage))) {
          const error = 'Subscription not chosen or client/payment form data is not valid';
          handleError(error, {
            subscriptionPlan,
            isClientFormDataValid,
            isSubscriptionFree,
            paymentPage,
          });
          yield put(A.onCheckoutStageCheckFailure(error));
          yield put(A.onSetCheckoutStage(CheckoutStage.STAGE_PAYMENT));
          return;
        } else {
          yield call(onRemovePersistPaymentPage);
        }
        break;
      }
      default: {
        handleError(new Error('checkoutPathCheck - invalid path'));
        break;
      }
    }
    if (!isDataUntilCurrentPathValid) {
      yield put(A.onCheckoutStageCheckSuccess());
    }
  } catch (error) {
    handleError(error);
    yield put(
      PopUpAlertsModelActions.onAddAlert(
        {
          humanMessage: humanMessages.finishPaymentErrorMessage,
        },
        'finishPaymentErrorMessage',
        false,
      ),
    );
  }
}

export function* onAdvanceFromSubscriptionDetails() {
  try {
    const isBillingEnabled: boolean = yield select(selectIsBillingEnabled);
    if (!isBillingEnabled) {
      return;
    }
    const isSubscriptionFree: boolean = yield select(selectIsChosenSubscriptionFree);
    if (isSubscriptionFree) {
      yield put(A.onSetCheckoutStage(CheckoutStage.STAGE_CONFIRMATION));
    } else {
      const isClientFormValid: boolean = yield select(selectIsClientFormDataValid);
      yield put(A.onClientShouldBeValidated());
      if (isClientFormValid) {
        const seatCount: number = yield select(selectNumberOfSeats);
        const subscriptionSeatCount: number = yield select(selectCurrentSubscriptionSeatCount);
        const workspaceUsers: List<Id> = yield select(selectCurrentOrganizationMemberUserIds);

        if (seatCount < workspaceUsers.size) {
          return yield put(
            PopUpAlertsModelActions.onAddAlert(
              {
                humanMessage: humanMessages.tooMuchUsersErrorMessage(seatCount, workspaceUsers.size),
              },
              'tooMuchUsersErrorMessage',
              false,
            ),
          );
        }
        const isLifetime: boolean = yield select(selectIsCurrentSubscriptionLifetime);

        if (isLifetime && seatCount <= subscriptionSeatCount) {
          return yield put(
            PopUpAlertsModelActions.onAddAlert(
              {
                humanMessage: humanMessages.downgradeErrorMessage(seatCount, subscriptionSeatCount),
              },
              'downgradeErrorMessage',
              false,
            ),
          );
        }

        yield call(onFetchPaymentPage);
        yield put(A.onSetCheckoutStage(CheckoutStage.STAGE_PAYMENT));
      }
    }
  } catch (error) {
    handleError(error);
  }
}

export function* onFetchPaymentPage() {
  try {
    const isBillingEnabled: boolean = yield select(selectIsBillingEnabled);
    if (!isBillingEnabled) {
      return null;
    }
    const subscriptionPlanId: Id = yield select(selectSubscriptionPlanId);
    let paymentPage: PaymentPageInterface = yield call(getPersistPaymentPage);
    if (!paymentPage) {
      paymentPage = yield call(onRequestSubscriptionPaymentPage, subscriptionPlanId);
    }
    if (paymentPage) {
      yield put(A.onSetPaymentPage(paymentPage));
    }

    return paymentPage;
  } catch (error) {
    handleError(error);
    return null;
  }
}

export function* onRequestSubscriptionPaymentPage(subscriptionPlanId: Id) {
  const currentOrganizationId = yield select(selectCurrentOrganizationId);
  const isBillingEnabled: boolean = yield select(selectIsBillingEnabled);
  if (!isBillingEnabled) {
    return null;
  }
  try {
    const clientFormData: ClientFormData = yield select(selectClientFormData);
    const planCode: string = yield select(selectPlanCode, {
      planId: subscriptionPlanId,
    });
    const currentUser: User = yield select(UsersModelSelectors.selectCurrentUser);
    const numberOfSeats: number = yield select(selectNumberOfSeats);
    const subscriptionData = {
      organizationId: currentOrganizationId,
      planId: planCode,
      seatCount: numberOfSeats,
      billingAddress: {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        locale: currentUser.locale,
        company: clientFormData.get(ClientFormField.NAME),
        line1: clientFormData.get(ClientFormField.STREET),
        city: clientFormData.get(ClientFormField.CITY),
        zip: clientFormData.get(ClientFormField.ZIP),
        country: clientFormData.get(ClientFormField.COUNTRY),
        state: clientFormData.get(ClientFormField.PROVINCE),
      },
    };
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.checkoutSubscriptionPaymentPage,
        currentOrganizationId,
        RequestStatus.LOADING,
      ),
    );
    const result = yield cps(client.restApiClient.checkoutSubscriptionPaymentPage, 'chargebee', subscriptionData);
    if (!result) {
      throw new Error('Payment page not fetched');
    }

    if (result.errorCode) {
      yield put(
        PopUpAlertsModelActions.onAddAlert({
          humanMessage: HumanMessage({
            kind: HumanMessageKind.error,
            text: result.body,
          }),
        }),
      );

      yield put(A.onCheckoutStageCheckFailure(result.body));
      return;
    }
    const billingPeriodId: Id = yield select(selectBillingPeriodId);
    yield call(setPersistPaymentPage, result, billingPeriodId);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.checkoutSubscriptionPaymentPage,
        currentOrganizationId,
        RequestStatus.SUCCESS,
      ),
    );

    return PaymentPage(result.payment);
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.checkoutSubscriptionPaymentPage,
        currentOrganizationId,
        RequestStatus.FAILURE,
        error,
      ),
    );
    return null;
  }
}

export function* onAdvanceFromSubscriptionChoice() {
  try {
    const isBillingEnabled: boolean = yield select(selectIsBillingEnabled);
    if (!isBillingEnabled) {
      return;
    }
    const isSubscriptionFree: boolean = yield select(selectIsChosenSubscriptionFree);
    if (isSubscriptionFree) {
      yield call(onRequestSubscriptionPaymentPage, SubscriptionPlanId.BASIC);
      yield put(A.onSetCheckoutStage(CheckoutStage.STAGE_CONFIRMATION));
    } else {
      yield put(A.onSetCheckoutStage(CheckoutStage.STAGE_SUBSCRIPTION_DETAILS));
    }
  } catch (error) {
    handleError(error);
  }
}

export function* onFinishCheckout() {
  try {
    yield call(onRemovePersistPaymentPage);
    yield put(A.onFinishCheckoutSuccess());
  } catch (error) {
    yield put(A.onFinishCheckoutFailure());
    handleError(error);
  }
}

function* setPersistPaymentPage(paymentData: PaymentDataPayload, billingPeriodId: Id) {
  const paymentPage: PaymentPageInterface = {
    ...paymentData.payment,
    planCode: paymentData.plan.planCode,
    billingPeriodId,
  };
  if (!validatePaymentPage(paymentPage)) {
    handleError(new Error('Invalid paymentPage format'));
    return;
  }
  try {
    const paymentPageJson: string = JSON.stringify(paymentPage);
    yield cps(localStorage.setItem, 'paymentPage', paymentPageJson);
  } catch (error) {
    handleError(error);
  }
}

function* onRemovePersistPaymentPage() {
  yield cps(localStorage.removeItem, 'paymentPage');
}

function* getPersistPaymentPage() {
  try {
    const paymentPageJson: string = yield cps(localStorage.getItem, 'paymentPage');
    if (!paymentPageJson) {
      return null;
    }
    const paymentPage: PaymentPageInterface = JSON.parse(paymentPageJson);
    if (!validatePaymentPage(paymentPage)) {
      handleError(new Error('Invalid paymentPage format'));
      yield call(onRemovePersistPaymentPage);
      return null;
    }

    const paymentPageRecord: PaymentPageRecordInterface = PaymentPage(paymentPage);
    yield put(A.onSetPaymentPage(paymentPageRecord));

    return paymentPageRecord;
  } catch (error) {
    handleError(error);
    return null;
  }
}

export function* onCancelOrganizationSubscription({ payload: { organizationId } }: PartialPayloadAction) {
  const isBillingEnabled: boolean = yield select(selectIsBillingEnabled);
  if (!isBillingEnabled) {
    return;
  }
  try {
    yield put(
      onSetRequestStatus(RequestTypesConstants.cancelOrganizationSubscription, organizationId, RequestStatus.LOADING),
    );
    yield cps(client.restApiClient.cancelOrganizationSubscription, 'chargebee', organizationId);

    yield put(
      onSetRequestStatus(RequestTypesConstants.cancelOrganizationSubscription, organizationId, RequestStatus.SUCCESS),
    );
    yield put(A.onSetSubscriptionCancellationStatus(organizationId, SubscriptionCancellationStatus.PENDING));
  } catch (error) {
    const statusCode: boolean | ResponseCode = get(error, 'params.statusCode');

    yield put(
      onSetRequestStatus(
        RequestTypesConstants.cancelOrganizationSubscription,
        organizationId,
        RequestStatus.FAILURE,
        error,
      ),
    );
    if ([!ResponseCode.FORBIDDEN, ResponseCode.RESOURCE_NOT_FOUND].includes(statusCode)) {
      handleError(error);
    }
  }
}

function* onUpdateSubscription({ payload: { subscriptionData } }: PartialPayloadAction) {
  const currentOrganizationId: Id = yield select(selectCurrentOrganizationId);
  const isBillingEnabled: boolean = yield select(selectIsBillingEnabled);
  if (!isBillingEnabled) {
    return;
  }
  try {
    yield put(
      onSetRequestStatus(RequestTypesConstants.updateSubscription, currentOrganizationId, RequestStatus.LOADING),
    );
    const { seatCount } = subscriptionData;

    const workspaceUsers: List<string> = yield select(selectCurrentOrganizationMemberUserIds);
    if (seatCount < workspaceUsers.size) {
      yield put(
        onSetRequestStatus(RequestTypesConstants.updateSubscription, currentOrganizationId, RequestStatus.FAILURE),
      );
      return yield put(
        PopUpAlertsModelActions.onAddAlert(
          {
            humanMessage: humanMessages.downgradeTooMuchUsersErrorMessage,
          },
          'downgradeTooMuchUsersErrorMessage',
          false,
        ),
      );
    }

    const occupiedGuestSeatCount: number = yield select(selectCurrentOrganizationOccupiedGuestSeatsCount);
    const availableGuestSeats: number = seatCount + ADDITIONAL_GUEST_SEATS;
    if (availableGuestSeats < occupiedGuestSeatCount) {
      yield put(
        onSetRequestStatus(RequestTypesConstants.updateSubscription, currentOrganizationId, RequestStatus.FAILURE),
      );
      return yield put(
        PopUpAlertsModelActions.onAddAlert(
          {
            humanMessage: humanMessages.downgradeTooMuchGuestsErrorMessage,
          },
          'downgradeTooMuchGuestsErrorMessage',
          false,
        ),
      );
    }

    const subscriptionPlanId: Id = yield select(selectCurrentSubscriptionPlanId);
    const planCode: string = yield select(selectPlanCode, {
      planId: subscriptionPlanId,
    });
    const paymentPage: PaymentDataPayload = yield cps(
      client.restApiClient.checkoutSubscriptionPaymentPage,
      'chargebee',
      {
        organizationId: currentOrganizationId,
        seatCount,
        planId: planCode,
      },
    );

    if (!paymentPage) {
      throw new Error('Payment page not fetched');
    }
    const paymentPageRecord: PaymentPageInterface = PaymentPage(paymentPage.payment);
    yield put(A.onSetPaymentPage(paymentPageRecord));
  } catch (error) {
    handleError(error, subscriptionData);
    yield put(
      onSetRequestStatus(RequestTypesConstants.updateSubscription, currentOrganizationId, RequestStatus.FAILURE, error),
    );
  }
}

function* onUpdateCustomSubscription({ payload: { subscriptionData } }: PartialPayloadAction) {
  try {
    const isBillingEnabled: boolean = yield select(selectIsBillingEnabled);
    if (!isBillingEnabled) {
      return;
    }
    const { seatCount } = subscriptionData;
    let planId: Id = yield select(selectCurrentSubscriptionPlanId);
    const isCurrentPlanFree = yield select(selectIsPlanFree, { planId });
    if (isCurrentPlanFree) {
      planId = yield select(selectFirstPremiumPlanId);
    }

    let currentSeatCount: number = yield select(selectCurrentSubscriptionSeatCount);
    if (!currentSeatCount) {
      currentSeatCount = yield select(selectUsersPerWorkspaceLimit);
    }

    const isLifetime: boolean = yield select(selectIsCurrentSubscriptionLifetime);

    if (isLifetime && seatCount < currentSeatCount) {
      return yield put(
        PopUpAlertsModelActions.onAddAlert(
          {
            humanMessage: humanMessages.downgradeErrorMessage(seatCount, currentSeatCount),
          },
          'downgradeErrorMessage',
          false,
        ),
      );
    }

    yield put(A.onSeatsNumberUpdate(seatCount));
    yield put(A.onSelectPlan(planId));

    const isTrial = yield select(selectIsCurrentSubscriptionTrial);
    const planCode = yield select(selectCurrentSubscriptionPlanCode);

    // Trial was changed to yearly. This check is needed not to break previous accounts.
    if (isTrial && planCode === SubscriptionPlanId.PRO_YEARLY) {
      yield put(A.onChooseBillingPeriod(BillingPeriodType.BILLING_PERIOD_YEARLY)); // affects only new accounts
    } else {
      yield put(A.onChooseBillingPeriod(BillingPeriodType.BILLING_PERIOD_MONTHLY)); // prev logic affects old accounts and deleted sub
    }

    yield call(onAdvanceFromSubscriptionChoice);
  } catch (error) {
    handleError(error, subscriptionData);
  }
}

function* onDownloadInvoice({ payload: { invoiceId } }: PartialPayloadAction) {
  const organizationId: Id = yield select(selectCurrentOrganizationId);
  const isBillingEnabled: boolean = yield select(selectIsBillingEnabled);
  if (!isBillingEnabled) {
    return;
  }
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.downloadInvoice, invoiceId, RequestStatus.LOADING));
    const fileUrl: string = yield cps(client.restApiClient.downloadInvoice, 'chargebee', organizationId, invoiceId);
    if (fileUrl) {
      window.location.href = fileUrl;
    }
    yield put(onSetRequestStatus(RequestTypesConstants.downloadInvoice, invoiceId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, { invoiceId, organizationId });
    yield put(onSetRequestStatus(RequestTypesConstants.downloadInvoice, invoiceId, RequestStatus.FAILURE, error));
  }
}

function* onPaymentSuccess() {
  try {
    const planCode: string = yield select(selectChosenPlanCode);
    yield call(UserTracker.track, UserTrackerEvent.subscriptionAdded, {
      plan: planCode,
    });
  } catch (error) {
    handleError(error);
  }
}
