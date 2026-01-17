import { Id } from "../../common/identifier";

import { UserProjectOrderDbRow } from "../../db/schema";

export interface PersonalProjectOrderProviderInterface {

  getProjectsOrderForUserInOrganization(userInOrganizationId: Id, trx?: Transaction): PromiseLike<UserProjectOrderDbRow[]>

  getProjectOrderEntity(userInOrganizationId: Id, projectId: Id, trx?: Transaction): PromiseLike<UserProjectOrderDbRow>

  getProjectOrderEntityById(id: Id, trx?: Transaction): PromiseLike<UserProjectOrderDbRow>

  insertPersonalProjectOrderEntry(
    userInOrganizationId: Id,
    projectId: Id,
    order: number,
    trx: Transaction
  ): PromiseLike<UserProjectOrderDbRow>

  insertPersonalProjectOrderEntries(
    personalProjectOrderItems: Partial<UserProjectOrderDbRow>[],
    trx?: Transaction,
  ): PromiseLike<UserProjectOrderDbRow[]>

  updatePersonalProjectOrderEntry(
    userInOrganizationId: Id,
    projectId: Id,
    order: number,
    trx: Transaction
  ): PromiseLike<void>

  deleteProjectOrderEntity(userInOrganizationId: Id, projectId: Id, trx?: Transaction): PromiseLike<void>

  deleteProjectOrderByProjectId(projectId: Id, trx?: Transaction): PromiseLike<void>

}