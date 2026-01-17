import { fromJS } from 'immutable';
import { Reducer } from 'redux';
import { PayloadAction } from '../../../types';
import * as AppModelConstants from '../AppModel/constants';
import * as CurrentUserConstants from '../CurrentUserModel/constants';
import * as C from './constants';
import { BillingPeriodType, CheckoutStage, SubscriptionState } from './types';

const initialState: SubscriptionState = fromJS({
  subscriptionData: {},
  organizationSubscriptionCancellation: {},
  plans: {},
  invoices: {},
  coupons: {},
  planId: null,
  validationFlags: {
    shouldClientBeValidated: false,
  },
  isDataUntilCurrentPathValid: false,
  currency: '$',
  billingPeriod: BillingPeriodType.BILLING_PERIOD_MONTHLY,
  numberOfSeats: 1,
  clientFormData: {
    name: '',
    street: '',
    city: '',
    zip: '',
    country: 'PL',
    province: '',
  },
  paymentPage: null,
  checkoutStage: CheckoutStage.STAGE_SUBSCRIPTION_CHOICE,
  checkoutFailure: null,
});

const subscriptionReducer: Reducer<SubscriptionState, PayloadAction> = (state = initialState, action) => {
  switch (action.type) {
    case C.onCheckoutStageCheckSuccess:
      return state.set('isDataUntilCurrentPathValid', true);

    case C.onCheckoutStageCheckFailure:
      return state.set('isDataUntilCurrentPathValid', false).set('checkoutFailure', action.payload.error);

    case C.onSetCheckoutStage: {
      const { checkoutStage } = action.payload;
      return state.set('checkoutStage', checkoutStage);
    }

    case C.onSetPaymentPage: {
      const { paymentPage } = action.payload;
      return state.set('paymentPage', paymentPage);
    }

    case C.onClientShouldBeValidated:
      return state.setIn(['validationFlags', 'shouldClientBeValidated'], true);

    case C.onSeatsNumberUpdate: {
      const { numberOfSeats } = action.payload;
      return state.setIn(['numberOfSeats'], numberOfSeats ? numberOfSeats : 1);
    }

    case C.onClientCountryUpdate:
      return state.setIn(['clientFormData', 'country'], action.payload.country);

    case C.onClientProvinceUpdate:
      return state.setIn(['clientFormData', 'province'], action.payload.province);

    case C.onClientZipUpdate:
      return state.setIn(['clientFormData', 'zip'], action.payload.zip);

    case C.onClientCityUpdate:
      return state.setIn(['clientFormData', 'city'], action.payload.city);

    case C.onClientStreetUpdate:
      return state.setIn(['clientFormData', 'street'], action.payload.street);

    case C.onClientNameUpdate:
      return state.setIn(['clientFormData', 'name'], action.payload.name);

    case C.onSelectPlan:
      return state.set('planId', action.payload.planId);

    case C.onChooseBillingPeriod:
      return state.set('billingPeriod', action.payload.billingPeriodId);

    case C.onPaymentSuccess:
      return state.set('checkoutStage', CheckoutStage.STAGE_CONFIRMATION);

    case C.onFinishCheckoutSuccess:
      return state
        .set('planId', null)
        .set('checkoutStage', CheckoutStage.STAGE_SUBSCRIPTION_CHOICE)
        .set('numberOfSeats', 1)
        .set('clientFormData', initialState.get('clientFormData'))
        .set('paymentPage', initialState.get('paymentPage'));

    case C.onCreateSubscriptionData:
    case C.onUpdateSubscriptionData: {
      const { subscription } = action.payload;
      return state.setIn(['subscriptionData', subscription.organizationId], subscription);
    }

    case C.onBatchSubscriptionData: {
      const { subscriptionData } = action.payload;
      return state.set('subscriptionData', state.get('subscriptionData').mergeDeep(subscriptionData));
    }

    case C.onRemoveSubscriptionData: {
      return state.deleteIn(['subscriptionData', action.payload.organizationId]);
    }

    case C.onCreatePlanData:
    case C.onUpdatePlanData: {
      const { plan } = action.payload;
      return state.setIn(['plans', plan.id], plan);
    }

    case C.onRemovePlanData: {
      return state.deleteIn(['plans', action.payload.planId]);
    }

    case C.onCreateInvoiceData:
    case C.onUpdateInvoiceData: {
      const { invoice } = action.payload;
      return state.setIn(['invoices', invoice.id], invoice);
    }

    case C.onRemoveInvoiceData: {
      return state.deleteIn(['invoices', action.payload.invoiceId]);
    }

    case C.onFetchSubscriptionDataSuccess: {
      const { subscriptionPlans, coupons } = action.payload.data;
      return state.set('plans', subscriptionPlans).set('coupons', coupons);
    }

    case C.onFetchSubscriptionInvoicesSuccess: {
      const { invoices } = action.payload.data;
      return state.set('invoices', invoices);
    }

    case C.onSetSubscriptionCancellationStatus: {
      return state.setIn(
        ['organizationSubscriptionCancellation', action.payload.organizationId],
        action.payload.status
      );
    }

    case C.onRemoveSubscriptionCancellationStatus: {
      return state.deleteIn(['organizationSubscriptionCancellation', action.payload.organizationId]);
    }

    case C.onUpdateSubscriptionCouponsData: {
      return state.set('coupons', action.payload.coupons);
    }

    case AppModelConstants.onCleanModels:
    case CurrentUserConstants.onSignOutSuccess:
      return initialState;

    default:
      return state;
  }
};

export default subscriptionReducer;
