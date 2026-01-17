import { get } from 'lodash';
import { SubscriptionPlanCode } from './types';

const NEW_PRICES_BY_PLAN = {
  [SubscriptionPlanCode.SUBSCRIPTION_TYPE_BASIC]: 0,
  [SubscriptionPlanCode.SUBSCRIPTION_TYPE_PRO_MONTHLY]: 399,
  [SubscriptionPlanCode.SUBSCRIPTION_TYPE_PRO_YEARLY]: 3588,
};

export const getAgentNewUnitPrice = (planCode: SubscriptionPlanCode) => get(NEW_PRICES_BY_PLAN, planCode);
