import {
  InviteUserToOrganizationAndCreateConversationResult,
  ResendInvitationToOrganizationResult,
  InviteGuestToOrganizationResult
} from "../types";
import { Id } from "../../common/identifier";
import { OrganizationRole } from "../../db/schema";


export interface InvitationServiceInterface {
  /**
 * Creates user, if not exists. Adds to provided organization and creates a project that is a conversation
 * between invitee and inviter.
 *
 * @param {Id} organizationId
 * @param {Id} projectId
 * @param {Id} currentUserId
 * @param {string} email
 * @param {Id} userId
 * @param {OrganizationRole} role
 * @return {Promise<InviteUserToOrganizationAndCreateConversationResult>}
 */
  inviteUserToOrganizationAndCreateConversation(
    organizationId: Id,
    projectId: Id,
    currentUserId: Id,
    email: string,
    userId?: Id,
    role?: OrganizationRole,
    trx?: Transaction
  ): PromiseLike<InviteUserToOrganizationAndCreateConversationResult>;

  /**
 * Creates user, if not exists. Adds to provided organization, creates a project that is a conversation 
 * between invitee and inviter and assing user to given project ids.
 *
 * @param {Id} organizationId
 * @param {Array<Id>} projectIds
 * @param {Id} currentUserId
 * @param {string} email
 * @param {Id} userId
 * @param {OrganizationRole} role
 * @return {Promise<InviteGuestToOrganizationResult>}
 */
  inviteGuestToOrganization(
    organizationId: Id,
    projectIds: Id[],
    currentUserId: Id,
    email: string,
  ): PromiseLike<InviteGuestToOrganizationResult>;

  resentInvitationToOrganization(
    organizationId: Id,
    inviterId: Id,
    invitedUserId: Id
  ): PromiseLike<ResendInvitationToOrganizationResult>
}
