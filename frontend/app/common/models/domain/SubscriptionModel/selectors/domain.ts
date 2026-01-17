import { ApplicationState } from 'common/types';
import { isStringNotEmpty } from 'common/utils/checkoutValidation';
import { Id } from 'common/utils/identifier';
import { List, Map, fromJS } from 'immutable';
import get from 'lodash/get';
import createCachedSelector from 're-reselect';
import { createSelector } from 'reselect';
import generateSelectorName from '../../../../utils/generateSelectorName';
import { RequestStatus } from '../../RequestModel/types';
import { domain } from '../constants';
import billingPeriodToSubscriptionMap from '../constants/billingPeriodToSubscriptionMap';
import planStaticConfig from '../constants/planStaticConfig';
import Countries from '../countries';
import {
  BillingPeriodType,
  CheckoutStage,
  ClientFormData,
  ClientFormField,
  Country,
  Coupons,
  Invoices,
  PaymentPageInterface,
  PaymentPageRecordInterface,
  PlanInterface,
  PlanRecordInterface,
  PlanStaticConfigInterface,
  Plans,
  SubscriptionInterface,
  SubscriptionState,
  SubscriptionStatus,
  ValidationFlags,
} from '../types';

const emptyMap = Map();
const emptyList = List();
/**
 * Direct selector to the checkoutPage state domain
 */
const selectSubscriptionDomain = (state: ApplicationState): SubscriptionState => state.get(domain);

/**
 * Other specific selectors
 */

export const selectCheckoutStage = createSelector(
  selectSubscriptionDomain,
  (data: SubscriptionState): CheckoutStage => data.get('checkoutStage'),
);

export const selectPaymentPage = createSelector(
  selectSubscriptionDomain,
  (data: SubscriptionState): PaymentPageInterface => data.get('paymentPage'),
);

export const selectCurrency = createSelector(selectSubscriptionDomain, (substate: SubscriptionState): string =>
  substate.get('currency'),
);

export const selectBillingPeriodId = createSelector(
  selectSubscriptionDomain,
  (data: SubscriptionState): BillingPeriodType => data.get('billingPeriod'),
);

export const selectSubscriptionPlanId = createSelector(
  selectSubscriptionDomain,
  (data: SubscriptionState): Id => (data.get('planId') ? data.get('planId').trim() : undefined),
);

export const selectNumberOfSeats = createSelector(selectSubscriptionDomain, (state: SubscriptionState): number =>
  state.get('numberOfSeats'),
);

export const selectClientFormData = createSelector(
  selectSubscriptionDomain,
  (data: SubscriptionState): ClientFormData => data.get('clientFormData'),
);

export const selectIsNumberOfSeatsValid = createSelector(
  selectSubscriptionDomain,
  (data: SubscriptionState): boolean => !!data.get('numberOfSeats'),
);

export const selectValidationFlags = createSelector(
  selectSubscriptionDomain,
  (state: SubscriptionState): ValidationFlags => state.get('validationFlags'),
);

export const selectShouldClientBeValidated = createSelector(
  selectValidationFlags,
  (state: ValidationFlags): boolean => state.get('shouldClientBeValidated'), // Move to const
);

export const selectIsDataUntilCurrentPathValid = createSelector(
  selectSubscriptionDomain,
  (state: SubscriptionState): boolean => state.get('isDataUntilCurrentPathValid'),
);

export const selectSubscriptionData = createSelector(
  selectSubscriptionDomain,
  (state: SubscriptionState): Map<Id, SubscriptionInterface> => state.get('subscriptionData'),
);

export const selectIsCheckoutFailed = createSelector(
  selectSubscriptionDomain,
  (state: SubscriptionState): boolean => !!state.get('checkoutFailure'),
);

export const selectSubscriptionPlans = createSelector(
  selectSubscriptionDomain,
  (state: SubscriptionState): Plans => state.get('plans'),
);

export const selectInvoices = createSelector(
  selectSubscriptionDomain,
  (state: SubscriptionState): Invoices => state.get('invoices'),
);

export const selectCoupons = createSelector(
  selectSubscriptionDomain,
  (state: SubscriptionState): Coupons => state.get('coupons'),
);

export const selectOrganizationSubscriptionCancellationRequestStatusDomain = createSelector(
  selectSubscriptionDomain,
  (subscriptionDomain: SubscriptionState) => subscriptionDomain.get('organizationSubscriptionCancellation'),
);

export const selectPaymentPageUrl = createSelector(
  selectPaymentPage,
  (paymentPage: PaymentPageRecordInterface): string => (paymentPage ? paymentPage.paymentUrl : null),
);

export const selectSubscriptionPlan = createSelector(
  selectSubscriptionPlanId,
  selectSubscriptionPlans,
  (planId: Id, plans: Plans): PlanInterface => plans.get(planId),
);

// args: subscriptionPlanId
export const selectPlanConfig = createCachedSelector(
  (_, args) => args.subscriptionPlanId,
  (subscriptionPlanId: Id): PlanStaticConfigInterface => planStaticConfig.get(subscriptionPlanId),
)((_, args) => generateSelectorName(args, ['subscriptionPlanId']));

// args: subscriptionPlanId
export const selectSubscriptionFeatures = createCachedSelector(
  selectPlanConfig,
  (subscription: PlanStaticConfigInterface): List<string> => (subscription ? subscription.features : undefined),
)((_, args) => generateSelectorName(args, ['subscriptionPlanId']));

// args: subscriptionPlanId
export const selectSubscriptionFeaturesAdditional = createCachedSelector(
  selectPlanConfig,
  (subscription: PlanStaticConfigInterface): List<string> =>
    subscription ? subscription.featuresAdditional : undefined,
)((_, args) => generateSelectorName(args, ['subscriptionPlanId']));

// args: subscriptionPlanId
export const selectSubscriptionRecommendedAudience = createCachedSelector(
  selectPlanConfig,
  (subscription: PlanStaticConfigInterface): string => (subscription ? subscription.recommendedAudience : null),
)((_, args) => generateSelectorName(args, ['subscriptionPlanId']));

// args: subscriptionPlanId
export const selectSubscriptionHasMultiSeats = createCachedSelector(
  selectPlanConfig,
  (subscription: PlanStaticConfigInterface): boolean => (subscription ? subscription.hasMultiSeats : null),
)((_, args) => generateSelectorName(args, ['subscriptionPlanId']));

export const selectIsSubscriptionPlanChosen = createSelector(
  selectSubscriptionPlan,
  (subscriptionPlan: PlanRecordInterface) => !!subscriptionPlan,
);

export const selectIsChosenSubscriptionFree = createSelector(
  selectSubscriptionPlan,
  (subscriptionPlan: PlanRecordInterface): boolean => (subscriptionPlan ? subscriptionPlan.costPerSeat === 0 : false),
);

export const selectChosenPlanCode = createSelector(selectSubscriptionPlan, (chosenPlan: PlanRecordInterface): string =>
  chosenPlan ? chosenPlan.planCode.trim() : null,
);

export const selectClientName = createSelector(selectClientFormData, (data: ClientFormData): string =>
  data.get(ClientFormField.NAME),
);

export const selectClientCity = createSelector(selectClientFormData, (data: ClientFormData): string =>
  data.get(ClientFormField.CITY),
);

export const selectClientStreet = createSelector(selectClientFormData, (data: ClientFormData): string =>
  data.get(ClientFormField.STREET),
);

export const selectClientZip = createSelector(selectClientFormData, (data: ClientFormData): string =>
  data.get(ClientFormField.ZIP),
);

export const selectClientCountry = createSelector(selectClientFormData, (data: ClientFormData): string =>
  data.get(ClientFormField.COUNTRY),
);

export const selectClientProvince = createSelector(selectClientFormData, (data: ClientFormData): string =>
  data.get(ClientFormField.PROVINCE),
);

export const selectIsClientNameValid = createSelector(selectClientName, (name: string): boolean =>
  isStringNotEmpty(name),
);

export const selectIsClientCityValid = createSelector(selectClientCity, (city: string): boolean =>
  isStringNotEmpty(city),
);

export const selectIsClientStreetValid = createSelector(selectClientStreet, (street: string): boolean =>
  isStringNotEmpty(street),
);

export const selectIsClientZipValid = createSelector(selectClientZip, (zip: string): boolean => isStringNotEmpty(zip));

export const selectIsClientCountryValid = createSelector(selectClientCountry, (country: string): boolean =>
  isStringNotEmpty(country),
);

export const selectIsClientProvinceValid = createSelector(selectClientProvince, (province: string): boolean =>
  isStringNotEmpty(province),
);

export const selectChosenCountry = createSelector(
  selectClientCountry,
  (country: ClientFormField): Country => Countries[country],
);

export const selectChosenCountryStatesMap = createSelector(
  selectChosenCountry,
  (country: Country): Map<string, string> => {
    let map = emptyMap as Map<string, string>;
    if (!country.states) {
      return map;
    }

    //@ts-ignore
    for (let [key, state] of Object.entries(country.states)) {
      // TODO
      map = map.set(key, state.name);
    }

    return map;
  },
);

export const selectIsClientFormDataValid = createSelector(
  [
    selectIsClientNameValid,
    selectIsClientStreetValid,
    selectIsClientCityValid,
    selectIsClientZipValid,
    selectIsClientProvinceValid,
    selectIsClientCountryValid,
    selectIsNumberOfSeatsValid,
  ],
  (
    name: boolean,
    street: boolean,
    city: boolean,
    zip: boolean,
    province: boolean,
    country: boolean,
    numberOfSeats: boolean,
  ): boolean => name && street && city && zip && province && country && numberOfSeats,
);

export const selectClientFormDataValidation = createSelector(
  [
    selectIsClientNameValid,
    selectIsClientStreetValid,
    selectIsClientCityValid,
    selectIsClientZipValid,
    selectIsClientProvinceValid,
    selectIsClientCountryValid,
  ],
  (
    name: boolean,
    street: boolean,
    city: boolean,
    zip: boolean,
    province: boolean,
    country: boolean,
  ): Map<string, boolean> =>
    fromJS({
      isNameValid: name,
      isStreetValid: street,
      isCityValid: city,
      isZipValid: zip,
      isProvinceValid: province,
      isCountryValid: country,
    }),
);

export const selectIsSubscriptionChoiceStage = createSelector(
  selectCheckoutStage,
  (stage: CheckoutStage): boolean => stage === CheckoutStage.STAGE_SUBSCRIPTION_CHOICE,
);

export const selectIsSubscriptionDetailsStage = createSelector(
  selectCheckoutStage,
  (stage: CheckoutStage): boolean => stage === CheckoutStage.STAGE_SUBSCRIPTION_DETAILS,
);

export const selectIsPaymentStage = createSelector(
  selectCheckoutStage,
  (stage: CheckoutStage): boolean => stage === CheckoutStage.STAGE_PAYMENT,
);

export const selectIsConfirmationStage = createSelector(
  selectCheckoutStage,
  (stage: CheckoutStage): boolean => stage === CheckoutStage.STAGE_CONFIRMATION,
);

export const selectFreePlanId = createSelector(selectSubscriptionPlans, (plans: Plans): Id => {
  const freePlan: PlanInterface = plans.valueSeq().find((plan) => plan.costPerSeat === 0);
  if (freePlan) {
    return freePlan.id;
  }
  return null;
});

export const selectFirstPremiumPlanId = createSelector(selectSubscriptionPlans, (plans: Plans): Id => {
  const premiumPlan: PlanInterface = plans.valueSeq().find((plan) => plan.costPerSeat !== 0); // ASK Grzegorz
  if (premiumPlan) {
    return premiumPlan.id;
  }
  return null;
});

export const selectEnabledPlanIds = createSelector(
  selectSubscriptionPlans,
  (plans: Plans): List<Id> =>
    plans
      .valueSeq()
      .toList()
      .filter((plan: PlanInterface) => plan.isEnabled)
      .sort((planA: PlanInterface, planB: PlanInterface) => {
        if (planA.costPerSeat && planB.costPerSeat) {
          return planA.costPerSeat - planB.costPerSeat;
        } else if (planA.costPerSeat) {
          return 1;
        } else {
          return -1;
        }
      })
      .map((plan) => plan.id) as List<Id>,
);

export const selectEnabledPlanIdsByCurrentBillingPeriod = createSelector(
  selectEnabledPlanIds,
  selectSubscriptionPlans,
  selectBillingPeriodId,
  (planIds: List<Id>, plans: Plans, billingPeriodId: BillingPeriodType) => {
    const result = planIds
      .map((planId) => {
        const plan = plans.get(planId);
        const newPlanCode = get(billingPeriodToSubscriptionMap, [plan.planCode.trim(), billingPeriodId]);
        const newPlan = plans.find((p) => p.planCode.trim() === newPlanCode); // Ask Grzegorz
        return newPlan.id;
      })
      .toSet()
      .toList();
    return result;
  },
);

// planId
export const selectPlan = createCachedSelector(
  selectSubscriptionPlans,
  (_, args) => args.planId,
  (plans: Plans, planId: Id): PlanInterface => plans.get(planId),
)((_, args) => generateSelectorName(args, ['planId']));

// planId
export const selectPlanName = createCachedSelector(selectPlan, (plan: PlanInterface): string =>
  plan && plan.name ? plan.name.trim() : null,
)((_, args) => generateSelectorName(args, ['planId']));

// planId
export const selectPlanCostPerSeat = createCachedSelector(selectPlan, (plan: PlanInterface): number =>
  plan ? plan.costPerSeat : null,
)((_, args) => generateSelectorName(args, ['planId']));

// planId
export const selectPlanCode = createCachedSelector(selectPlan, (plan: PlanInterface): string =>
  plan ? plan.planCode.trim() : null,
)((_, args) => generateSelectorName(args, ['planId']));

// planId
export const selectIsPlanFree = createCachedSelector(selectPlan, (plan: PlanInterface): boolean =>
  plan ? plan.costPerSeat === 0 : true,
)((_, args) => generateSelectorName(args, ['planId']));

// planId
export const selectPlanBillingPeriod = createCachedSelector(selectPlanCode, (currentPlanCode: string) => {
  if (!currentPlanCode) {
    return BillingPeriodType.BILLING_PERIOD_MONTHLY;
  }
  const availableBilligPeriods = get(billingPeriodToSubscriptionMap, [currentPlanCode]);

  const billingPeriodKeys = Object.keys(availableBilligPeriods);
  for (let i = 0; i < billingPeriodKeys.length; i++) {
    const period = billingPeriodKeys[i];
    const planCode = availableBilligPeriods[period];
    if (planCode === currentPlanCode) {
      return period;
    }
  }
})((_, args) => generateSelectorName(args, ['planId']));

// args: organizationId
export const selectOrganizationSubscriptionCancellationRequestStatus = createSelector(
  selectOrganizationSubscriptionCancellationRequestStatusDomain,
  (_, args) => args.organizationId,
  (organizationSubscriptionCancellation, organizationId: Id): RequestStatus =>
    organizationSubscriptionCancellation.get(organizationId),
);

// args: organizationId
export const selectIsOrganizationSubscriptionCancellationRequestPending = createSelector(
  selectOrganizationSubscriptionCancellationRequestStatus,
  (status: string): boolean => status === 'pending',
);

// organizationId
export const selectSubscription = createSelector(
  selectSubscriptionData,
  (_, args) => args.organizationId,
  (subscriptionData: Map<Id, SubscriptionInterface>, organizationId: Id) =>
    // @ts-ignore
    subscriptionData.get(organizationId)?.toJS(), // It's Immutable Record type
);

// organizationId
export const selectSubscriptionStatus = createCachedSelector(
  selectSubscription,
  (subscription: SubscriptionInterface): SubscriptionStatus => (subscription ? subscription.status : null),
)((_, args) => generateSelectorName(args, ['organizationId']));
