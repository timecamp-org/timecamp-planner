import { Id } from "../../common/identifier";
import { OrganizationSubscriptionCancellationStatus } from "../types";

import { Maybe } from "../../common/types";

export interface SubscriptionCancellationProviderInterface {
  getSubscriptionCancellationRequestStatus(organizationId: Id, trx?: Transaction): PromiseLike<Maybe<OrganizationSubscriptionCancellationStatus>>;

  setSubscriptionCancellationRequestStatus(organizationId: Id, subscriptionId: Id, status: OrganizationSubscriptionCancellationStatus, trx?: Transaction): PromiseLike<void>;
}
