import {
  OrganizationJson,
  CreateOrganizationResult,
  GetOrganizationResult,
  UpdateOrganizationResult,
  GetOrganizationProjectsResult,
  InviteUserToOrganizationResult,
  UserAddedToOrganizationEventData,
  PrepareAndSendInvitationMailResult,
  GenerateInvitationLinkResult,
} from '../types';

import { Id } from '../../common/identifier';

import { OrganizationDbRow, UserInOrganizationDbRow, OrganizationRole } from '../../db/schema';
import { EventDelegate } from '../../../../../utils/EventDelegate';
import { QueryModifier } from '../../../../../services/types';
import { Dict, Maybe } from '../../common/types';

/**
 * Main organization operations.
 */
export interface OrganizationServiceInterface {

  /**
   * Creates organization and adds given user to organization with role OWNER.
   *
   * @param {Id} creatorId
   * @param {OrganizationJson} organizationJson
   * @param {Id} organizationId
   * @return {Promise<CreateOrganizationResult>}
   */
  createOrganization(
    creatorId: Id,
    organizationJson: OrganizationJson,
    organizationId?: Id
  ): Promise<CreateOrganizationResult>

  /**
   * @param {Transaction} trx
   * @param {Id} creatorId
   * @param {OrganizationJson} organizationJson
   * @param {Id} organizationId
   * @return {Promise<CreateOrganizationResult>}
   */
  doCreateOrganization(
    trx: Transaction,
    creatorId: Id,
    organizationJson: OrganizationJson,
    organizationId?: Id
  ): Promise<CreateOrganizationResult>

  /**
   * @param {Id} organizationId
   * @return {Promise<GetOrganizationResult>}
   */
  getOrganization(organizationId: Id, trx?: Transaction): Promise<GetOrganizationResult>

  /**
   * Updates organization
   *
   * @param {OrganizationJson} organizationJson
   * @param {Id} organizationId
   * @return {Promise<UpdateOrganizationResult>}
   */
  updateOrganization(organizationJson: OrganizationJson, organizationId: Id): Promise<UpdateOrganizationResult>

  /**
   * @param {Id} organizationId
   * @param {QueryModifier} decorate
   * @return {Promise<GetOrganizationProjectsResult>}
   */
  getOrganizationProjects(organizationId: Id, decorate?: QueryModifier, trx?: Transaction): Promise<GetOrganizationProjectsResult>

  /**
   * @param {Id} organizationId
   * @param {string} email
   * @param {Id} userId?
   * @return {Promise<InviteUserToOrganizationResult>}
   */
  inviteUserToOrganization(
    inviterId: Id,
    organizationId: Id,
    email: string,
    userId?: Id
  ): Promise<InviteUserToOrganizationResult>

  /**
   * @param {Id} organizationId
   * @param trx
   * @return {Promise<number>}
   */
  getOrganizationUserCount(organizationId: Id, withoutBot?: boolean, trx?: Transaction, decorate?: QueryModifier): Promise<number>

  /**
   * @param {Id} userId
   * @return {Promise<OrganizationDbRow>}
   */
  getOrganizationsForUser(userId: Id, trx?: Transaction, decorateQuery?: QueryModifier): PromiseLike<Array<OrganizationDbRow>>
  
  /**
   * @param {Id} userId
   * @return {Promise<Dict<OrganizationRole>>}
   */
  getOrganizationRolesForUser(userId: Id): PromiseLike<Dict<OrganizationRole>>


  /**
   * Organization and user must exits.
   *
   * @param {Transaction} trx
   * @param {Id} organizationId
   * @param {Id} userId
   * @param role
   * @return {Promise<void>}
   */
  doAddUserToOrganization(
    trx: Transaction,
    organizationId: Id,
    userId: Id,
    role: string
  ): Promise<UserInOrganizationDbRow>;

  /**
   *
   * @param {Id} inviterId
   * @param {Knex.Transaction} trx
   * @param {Id} organizationId
   * @param {string} email
   * @param {Id} userId
   * @returns {Promise<InviteUserToOrganizationResult>}
   */
  doInviteUserToOrganization(
    trx: Transaction,
    inviterId: Id,
    organizationId: Id,
    email: string,
    userId?: Id,
    role?: OrganizationRole,
  ): Promise<InviteUserToOrganizationResult>;

  userAddedToOrganizationEvent: EventDelegate<UserAddedToOrganizationEventData>

  prepareAndSendInvitationMail(inviterId: Id, invitedUserId: Id, organizationId: Id, isResent?: boolean, trx?: Transaction): PromiseLike<PrepareAndSendInvitationMailResult> ;

  generateInvitationLink(invitedUserId: Id, trx?: Transaction): PromiseLike<GenerateInvitationLinkResult>

  getOrganizationIdByProjectId(projectId: Id, trx?: Transaction): PromiseLike<Maybe<Id>>

  getOrganizationIdByListId(listId: Id, trx?: Transaction): Promise<Maybe<Id>>

  getOrganizationIdByTaskId(taskId: Id, trx?: Transaction): PromiseLike<Maybe<Id>>
}
