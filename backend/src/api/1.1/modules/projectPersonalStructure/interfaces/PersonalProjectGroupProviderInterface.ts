import { Id } from "../../common/identifier";

import { UserProjectGroupDbRow } from "../../db/schema";
import { ProjectGroupJson } from "../types";

export interface PersonalProjectGroupProviderInterface {

  createPersonalProjectGroup(personalProjectGroup: UserProjectGroupDbRow, trx?: Transaction): PromiseLike<UserProjectGroupDbRow>

  getPersonalProjectGroup(groupId: Id, trx?: Transaction): PromiseLike<UserProjectGroupDbRow>

  getAllPersonalProjectGroupsForUserInOrganization(userInOrganizationId: Id, trx?: Transaction): PromiseLike<UserProjectGroupDbRow[]>

  updatePersonalProjectGroup(id: Id, personalProjectGroup: ProjectGroupJson, trx?: Transaction): PromiseLike<void>

  deletePersonalProjectGroup(groupId: Id, trx?: Transaction): PromiseLike<void>

}
