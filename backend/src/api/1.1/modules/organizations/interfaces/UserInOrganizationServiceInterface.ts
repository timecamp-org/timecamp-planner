import { OrganizationRole, PublicUserDbRow, UserInOrganizationDbRow } from "../../db/schema";
import {
  CheckIfUserIsOrganizationAdminStatusResult,
  CheckIfUserIsOrganizationOwnerStatusResult,
  GetOrganizationOwnerIdResult,
  DeactivateUserFromWorkspaceResult,
  ReactivateUserFromWorkspaceResult,
  UpdateUserRoleResult,
  CheckIfUserIsOrganizationGuestStatusResult,
  CheckIfUserIsOrganizationMemberStatusResult,
} from "../types";
import { Id } from "../../common/identifier";


export interface UserInOrganizationServiceInterface {
  getOrganizationOwnerId(organizationId: Id, trx?: Transaction): PromiseLike<GetOrganizationOwnerIdResult>;

  checkIfUserIsOrganizationAdmin(userId: Id, organizationId: Id, trx?: Transaction): PromiseLike<CheckIfUserIsOrganizationAdminStatusResult>;

  checkIfUserIsOrganizationOwner(userId: Id, organizationId: Id, trx?: Transaction): PromiseLike<CheckIfUserIsOrganizationOwnerStatusResult>;

  checkIfUserIsOrganizationGuest(userId: Id, organizationId: Id, trx?: Transaction): PromiseLike<CheckIfUserIsOrganizationGuestStatusResult>;

  checkIfUserIsOrganizationMember(userId: Id, organizationId: Id, trx?: Transaction): PromiseLike<CheckIfUserIsOrganizationMemberStatusResult>;

  getUserInOrganization(userId: Id, organizationId: Id, trx?: Transaction): PromiseLike<UserInOrganizationDbRow>;

  hasUserPermissionToDeactivate(currentUserId: Id, userId: Id, organizationId: Id): PromiseLike<boolean>;

  /**
 * Return true if user is in organization
 * @param organizationId
 * @param userId
 */
  checkIfUserIsInOrganization(organizationId: Id, userId: Id, trx?: Transaction): PromiseLike<boolean>

  deactivateUserFromWorkspace(currentUserId: Id, userId: Id, organizationId: Id, trx?: Transaction): PromiseLike<DeactivateUserFromWorkspaceResult>

  doDeactivateUserFromWorkspace(userId: Id, organizationId: Id, trx?: Transaction): PromiseLike<DeactivateUserFromWorkspaceResult>

  reactivateUserFromWorkspace(currentUserId: Id, userId: Id, organizationId: Id, role?: OrganizationRole, trx?: Transaction): PromiseLike<ReactivateUserFromWorkspaceResult>

  updateUserRole(userId: Id, organizationId: Id, role: OrganizationRole): PromiseLike<UpdateUserRoleResult>;

  getOrganizationPeople(organizationId: Id, trx?: Transaction): PromiseLike<PublicUserDbRow[]>
}
