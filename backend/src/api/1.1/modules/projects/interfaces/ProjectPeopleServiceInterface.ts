
import {
  UserInProjectDbRow
} from '../../db/schema';
import {
  AddProjectPersonResult,
  AddProjectPersonsResult,
  DeleteProjectPeopleRoleResult,
  UpdateProjectPeopleRoleResult,
  DeleteGuestFromAllSpacesResult,
  RemoveProjectMemberEventData,
  UserInProjectJson,
  GetProjectPersonsResult,
} from '../types'
import { Id } from '../../common/identifier';
import { EventDelegate } from '../../../../../utils/EventDelegate';
import { QueryModifier } from '../../../../../services/types';
import { GetOrganizationProjectsPeopleResult, OrganizationProjectsPeople } from '../../organizations/types';

export interface ProjectPeopleServiceInterface {

  deleteGuestFromAllSpaces(currentUserId: Id, userId: Id, organizationId: Id): PromiseLike<DeleteGuestFromAllSpacesResult>

  addProjectPerson(projectPerson: UserInProjectJson, actorId?: Id): PromiseLike<AddProjectPersonResult>

  doAddProjectPerson(trx: Transaction, projectPerson: UserInProjectJson, actorId?: Id): PromiseLike<AddProjectPersonResult>

  addProjectPersons(projectPersons: UserInProjectJson[], actorId?: Id): PromiseLike<AddProjectPersonsResult>

  getProjectPersons(projectId: Id): PromiseLike<GetProjectPersonsResult>;

  doAddProjectPersons(trx: Transaction, projectPersons: UserInProjectJson[], actorId?: Id): PromiseLike<AddProjectPersonsResult>

  updateProjectPeopleRole(projectPerson: UserInProjectJson): PromiseLike<UpdateProjectPeopleRoleResult>

  deleteProjectPeopleRole(projectId: Id, userId: Id, actorId?: Id): PromiseLike<DeleteProjectPeopleRoleResult>

  doDeleteProjectPeopleRole(trx: Transaction, projectId: Id, userId: Id, actorId?: Id): PromiseLike<DeleteProjectPeopleRoleResult>

  getProjectPeople(projectId: Id, trx?: Transaction): PromiseLike<UserInProjectDbRow[]>

  getUserIdsInProject(projectId: Id, trx?: Transaction): PromiseLike<Array<Id>>

  deleteUserFromOrganizationSpaces(userId: Id, organizationId: Id, actodId: Id, trx?: Transaction): PromiseLike<void>

  removeProjectMemberEvent: EventDelegate<RemoveProjectMemberEventData>

  addProjectMemberEvent: EventDelegate<RemoveProjectMemberEventData>

    /**
   * @param {Id} organizationId
   * @param {QueryModifier} decorate
   * @return {PromiseLike<GetOrganizationProjectsPeopleResult>}
   */
  getOrganizationProjectsPeople(organizationId: Id, decorate?: QueryModifier): PromiseLike<GetOrganizationProjectsPeopleResult>

  getOrganizationProjectsPeopleForUser(organizationId: Id, userId: Id): PromiseLike<OrganizationProjectsPeople>

}
