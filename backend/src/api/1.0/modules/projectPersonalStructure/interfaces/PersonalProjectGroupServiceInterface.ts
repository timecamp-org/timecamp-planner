import { Id } from "../../common/identifier";
import {
  CreatePersonalProjectGroupResult, DeletePersonalProjectGroupResult, DeleteProjectGroupEventData, ProjectGroupJson,
  UpdatePersonalProjectGroupResult,
} from "../types";
import { EventDelegate } from "../../../../../utils/EventDelegate";

export interface PersonalProjectGroupServiceInterface {

  createPersonalProjectGroup(projectGroupJson: ProjectGroupJson): PromiseLike<CreatePersonalProjectGroupResult>

  updatePersonalProjectGroup(
    groupId: Id,
    personalProjectGroup: ProjectGroupJson,
  ): PromiseLike<UpdatePersonalProjectGroupResult>

  deletePersonalProjectGroup(groupId: Id): PromiseLike<DeletePersonalProjectGroupResult>

  deletePersonalProjectGroupEvent: EventDelegate<DeleteProjectGroupEventData>

}