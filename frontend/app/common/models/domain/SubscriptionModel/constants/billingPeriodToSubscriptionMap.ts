import { BillingPeriodType } from '../types';
import { SubscriptionPlanId } from '../types';

export default {
  [SubscriptionPlanId.BASIC]: {
    [BillingPeriodType.BILLING_PERIOD_MONTHLY]: SubscriptionPlanId.BASIC,
    [BillingPeriodType.BILLING_PERIOD_YEARLY]: SubscriptionPlanId.BASIC,
  },
  [SubscriptionPlanId.PRO_MONTHLY]: {
    [BillingPeriodType.BILLING_PERIOD_MONTHLY]: SubscriptionPlanId.PRO_MONTHLY,
    [BillingPeriodType.BILLING_PERIOD_YEARLY]: SubscriptionPlanId.PRO_YEARLY,
  },
  [SubscriptionPlanId.PRO_YEARLY]: {
    [BillingPeriodType.BILLING_PERIOD_MONTHLY]: SubscriptionPlanId.PRO_MONTHLY,
    [BillingPeriodType.BILLING_PERIOD_YEARLY]: SubscriptionPlanId.PRO_YEARLY,
  },
};
