import { AbstractPostgresProvider } from "../../postgresDataProvider/AbstractPostgresProvider";
import { PersonalProjectOrderProviderInterface } from "../interfaces/PersonalProjectOrderProviderInterface";
import { Id } from "../../common/identifier";

import Table from "../../db/Table";
import { UserProjectOrderDbRow } from "../../db/schema";
import { injectable } from 'inversify';
import { first } from 'lodash'

@injectable()
export class PersonalProjectOrderProvider
  extends AbstractPostgresProvider
  implements PersonalProjectOrderProviderInterface {

  async getProjectsOrderForUserInOrganization(userInOrganizationId: Id, trx?: Transaction): Promise<UserProjectOrderDbRow[]> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .select()
      .from(Table.USER_PROJECT_ORDER)
      .where({ userInOrganizationId })
      .orderBy('order')
  }

  async getProjectOrderEntity(userInOrganizationId: Id, projectId: Id, trx?: Transaction): Promise<UserProjectOrderDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .select()
      .from(Table.USER_PROJECT_ORDER)
      .where({ userInOrganizationId, projectId })
      .first()
  }

  async getProjectOrderEntityById(id: Id, trx?: Transaction): Promise<UserProjectOrderDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .select()
      .from(Table.USER_PROJECT_ORDER)
      .where({ id })
      .first()
  }

  async insertPersonalProjectOrderEntry(
    userInOrganizationId: Id,
    projectId: Id,
    order: number,
    trx?: Transaction,
  ): Promise<UserProjectOrderDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)

    const result = await query
      .table(Table.USER_PROJECT_ORDER)
      .insert({
        userInOrganizationId,
        projectId,
        order,
      })
      .returning('*')

    return first(result)
  }

  async insertPersonalProjectOrderEntries(
    personalProjectOrderItems: Partial<UserProjectOrderDbRow>[],
    trx?: Transaction,
  ): Promise<UserProjectOrderDbRow[]> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .table(Table.USER_PROJECT_ORDER)
      .insert(personalProjectOrderItems)
      .returning('*')
  }

  async updatePersonalProjectOrderEntry(
    userInOrganizationId: Id,
    projectId: Id,
    order: number,
    trx?: Transaction,
  ): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .table(Table.USER_PROJECT_ORDER)
      .where({ userInOrganizationId, projectId })
      .update({ order })
  }

  async deleteProjectOrderEntity(userInOrganizationId: Id, projectId: Id, trx?: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .table(Table.USER_PROJECT_ORDER)
      .where({ userInOrganizationId, projectId })
      .delete()
  }

  async deleteProjectOrderByProjectId(projectId: Id, trx?: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .table(Table.USER_PROJECT_ORDER)
      .where({ projectId })
      .delete()
  }

}