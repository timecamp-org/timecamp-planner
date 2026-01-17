import { SubscriptionInOrganizationDbRow } from "../../db/schema";

import { Id } from "../../common/identifier";
import { GetSubscriptionViewDataResult } from "../types";

export interface SubscriptionServiceInterface {
  
  getAvailableGuestSeatsInOrganization(organizationId: Id, trx?: Transaction): PromiseLike<number>;

  getAvailableMemberSeatsInOrganization(organizationId: Id, trx?: Transaction): PromiseLike<number>;

  isSubscriptionActiveAndNotFree(subscription: SubscriptionInOrganizationDbRow, trx?: Transaction): PromiseLike<boolean>;

  getSubscriptionViewData(organizationId: Id): PromiseLike<GetSubscriptionViewDataResult>;
  
  isSubscriptionActiveAndNotFreeForOrganization(organizationId: Id, trx?: Transaction): PromiseLike<boolean>;

  getUserOwnedOrganizationSubscriptions(userId: Id): PromiseLike<SubscriptionInOrganizationDbRow[]>

  isExtensionAvailableForOrganization(extensionId: Id, organizationId: Id): PromiseLike<boolean>;

  createTrialSubscription(organizationId: Id, trx: Transaction): PromiseLike<SubscriptionInOrganizationDbRow>;
}
