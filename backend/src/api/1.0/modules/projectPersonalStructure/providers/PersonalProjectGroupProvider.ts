import { PersonalProjectGroupProviderInterface } from "../interfaces/PersonalProjectGroupProviderInterface";
import { AbstractPostgresProvider } from "../../postgresDataProvider/AbstractPostgresProvider";
import { injectable } from 'inversify';
import { Id } from "../../common/identifier";
import { UserProjectGroupDbRow } from "../../db/schema";

import Table from "../../db/Table";
import { first } from "lodash";
import { ProjectGroupJson } from "../types";

@injectable()
export class PersonalProjectGroupProvider
  extends AbstractPostgresProvider
  implements PersonalProjectGroupProviderInterface {

  async createPersonalProjectGroup(personalProjectGroup: UserProjectGroupDbRow, trx?: Transaction): Promise<UserProjectGroupDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)

    const result = await query
      .insert(personalProjectGroup)
      .into(Table.USER_PROJECT_GROUP)
      .returning('*')

    return first(result)
  }

  async getAllPersonalProjectGroupsForUserInOrganization(userInOrganizationId: Id, trx?: Transaction): Promise<UserProjectGroupDbRow[]> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .select()
      .from(Table.USER_PROJECT_GROUP)
      .where({ userInOrganizationId })
  }

  async getPersonalProjectGroup(groupId: Id, trx?: Transaction): Promise<UserProjectGroupDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .select()
      .from(Table.USER_PROJECT_GROUP)
      .where({ id: groupId })
      .first()
  }

  async updatePersonalProjectGroup(id: Id, personalProjectGroup: ProjectGroupJson, trx?: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .table(Table.USER_PROJECT_GROUP)
      .where({ id })
      .update(personalProjectGroup)
  }

  async deletePersonalProjectGroup(groupId: Id, trx?: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx)

    await query
      .table(Table.USER_PROJECT_GROUP)
      .where({ id: groupId })
      .delete()
  }
}