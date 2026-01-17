import {
  UserFollowsProjectDbRow,
} from '../../db/schema';
import {
  AddProjectFollowerResult,
  ProjectsFollowersMap,
  RemoveProjectFollowerEventData,
  RemoveProjectFollowerResult,
} from '../types'
import { EventDelegate } from '../../../../../utils/EventDelegate';
import { Id } from '../../common/identifier';


export interface ProjectFollowersServiceInterface {

  addProjectFollower(projectId, userId): Promise<AddProjectFollowerResult>

  removeProjectFollower(projectId, userId): Promise<RemoveProjectFollowerResult>

  getProjectFollowerIds(projectId): Promise<Id[]>

  getProjectsFollowerIds(projectIds: Array<Id>, trx?: Transaction): Promise<ProjectsFollowersMap>

  getUsersFollowingProjects(projectIds: Array<Id>, trx?: Transaction): Promise<UserFollowsProjectDbRow[]>

  removeProjectFollowerEvent: EventDelegate<RemoveProjectFollowerEventData>

}
