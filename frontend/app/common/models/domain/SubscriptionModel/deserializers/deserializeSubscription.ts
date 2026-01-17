import { SubscriptionInterface } from '../types';

export function deserializeSubscription(subscription: SubscriptionInterface): SubscriptionInterface {
  return {
    ...subscription,
    nextBillingAmount:
      typeof subscription.nextBillingAmount === 'string'
        ? parseInt(subscription.nextBillingAmount)
        : subscription.nextBillingAmount,
  };
}
