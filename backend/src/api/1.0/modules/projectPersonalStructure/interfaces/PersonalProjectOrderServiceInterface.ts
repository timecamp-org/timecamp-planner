import { Id } from "../../common/identifier";
import {
  DeleteProjectGroupEventData, PersonalProjectOrderJson, ProjectOrderMap,
  UpdateOrganizationProjectOrderResult
} from "../types";
import { AddProjectMemberEventData, RemoveProjectMemberEventData, UpdateProjectEventData } from "../../projects/types";


export interface PersonalProjectOrderServiceInterface {

  getPersonalProjectStructure(userInOrganizationId: Id, trx?: Transaction): PromiseLike<ProjectOrderMap>

  updatePersonalProjectOrder(
    personalProjectOrder: PersonalProjectOrderJson,
  ): PromiseLike<UpdateOrganizationProjectOrderResult>

  placeProjectOnTop(userId: Id, organizationId: Id, projectId: Id, trx?: Transaction): PromiseLike<void>

  onAddProjectMember(params: AddProjectMemberEventData): PromiseLike<void>

  onRemoveProjectMember(params: RemoveProjectMemberEventData): Promise<void>

  onDeleteProjectGroup(params: DeleteProjectGroupEventData): PromiseLike<void>

  onUpdateProject(params: UpdateProjectEventData): Promise<void>

  publishDetermineOrderForUnarchivedSpaceJob(
    projectId: Id, organizationId: Id, lastUserId?: Id,
  ): PromiseLike<void>

 }
