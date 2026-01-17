import { Id } from "../../common/identifier";
import { SubscriptionJson } from "../types";
import { SubscriptionInOrganizationDbRow } from "../../db/schema";


export interface SubscriptionProviderInterface {
  getSubscriptionForOrganizationId(organizationId: Id, trx?: Transaction): PromiseLike<SubscriptionInOrganizationDbRow>;

  getSubscriptionsForOrganizationIds(organizationIds: Id[], trx?: Transaction): PromiseLike<SubscriptionInOrganizationDbRow[]>;

  getSubscriptionByAgentSubscriptionId(agentSubscriptionId: Id, trx?: Transaction): PromiseLike<SubscriptionInOrganizationDbRow>;

  createSubscription(subscription: SubscriptionJson, trx?: Transaction): PromiseLike<SubscriptionInOrganizationDbRow>;
  
  updateSubscription(subscriptionId: Id, subscription: SubscriptionJson, trx?: Transaction): PromiseLike<SubscriptionInOrganizationDbRow>;

  getExpiredInternalTrialSubscriptions(expiresAt: Date): PromiseLike<SubscriptionInOrganizationDbRow[]>

  terminateExpiredInternalTrialSubscriptions(expiresAt: Date): PromiseLike<void>;

  getInternalTrialSubscriptionsWithExpirationUntilDays(days: number): PromiseLike<SubscriptionInOrganizationDbRow[]>
}
