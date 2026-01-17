import { SubscriptionPlanDbRow } from '../../db/schema';

import { Id } from '../../common/identifier';

export interface SubscriptionPlanProviderInterface {
  getSubscriptionPlan(planCode: string, trx?: Transaction): PromiseLike<SubscriptionPlanDbRow>;
  getSubscriptionPlans(): PromiseLike<SubscriptionPlanDbRow[]>;
  getPlanById(id: Id, trx?: Transaction): Promise<SubscriptionPlanDbRow>;
}
