import { Id } from '../../common/identifier'
import {
  CancelOrganizationSubscriptionResult,
  OrganizationSubscriptionCancellationStatus,
  SetOrganizationSubscriptionCancellationResult,
} from '../types'


export interface ManualSubscriptionCanellationServiceInterface {
  cancelOrganizationSubscription(organizationId: Id, userId: Id): Promise<CancelOrganizationSubscriptionResult>

  setOrganizationSubscriptionCancellationStatus(organizationId: Id, status: OrganizationSubscriptionCancellationStatus): Promise<SetOrganizationSubscriptionCancellationResult>

  doSetOrganizationSubscriptionCancellationStatus(trx: Transaction, organizationId: Id, status: OrganizationSubscriptionCancellationStatus): Promise<SetOrganizationSubscriptionCancellationResult>

}
