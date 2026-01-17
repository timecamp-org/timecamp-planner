import { ChatWithMeCustomFieldsProviderInterface } from "./interfaces/ChatWithMeCustomFieldsProviderInterface";
import { get } from 'lodash'

import { injectable, inject } from "inversify";
import { OrganizationsModule } from "../organizations/OrganizationsModule";
import { ExtensionsModule } from "../extensions/ExtensionsModule";
import { UserInOrganizationProviderInterface } from "../organizations/interfaces/UserInOrganizationProviderInterface";
import { CustomFieldServiceInterface } from "../extensions/interfaces/CustomFieldServiceInterface";
import { CustomFieldTargetType, ChatWithMeTokenDbRow } from "../db/schema";
import { ExtensionNamespace } from "../extensions/types";
import { Id } from "../common/identifier";
import Table from "../db/Table";
import { DbModule } from "../db/DbModule";
import { ConnectionInterface } from "../db/ConnectionInterface";

@injectable()
export class ChatWithMeCustomFieldsProvider implements ChatWithMeCustomFieldsProviderInterface {

  protected userInOrganizationProvider: UserInOrganizationProviderInterface;
  protected customFieldService: CustomFieldServiceInterface;

  constructor(
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    userInOrganizationProvider: UserInOrganizationProviderInterface,
    @inject(ExtensionsModule.CustomFieldServiceInterface)
    customFieldService: CustomFieldServiceInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {

    this.userInOrganizationProvider = userInOrganizationProvider
    this.customFieldService = customFieldService
  }

  async getInvitationTokenDbRow(token: string, trx?: Transaction): Promise<ChatWithMeTokenDbRow> {
    let query = this.connection.getQueryWithTransaction(trx)
    return await query
      .select()
      .from(Table.CHAT_WITH_ME_TOKEN)
      .where({ token })
      .first()
  }

  async getInviterId(userId: Id, organizationId: Id, trx?: Transaction): Promise<Id>
  {
    const userInOrganization = await this.userInOrganizationProvider.getUserInOrganization(userId, organizationId, trx)
    const customFieldResult = await this.customFieldService.getValues(
      CustomFieldTargetType.USER_IN_ORGANIZATION, 
      userInOrganization.id, 
      ExtensionNamespace.CHAT_WITH_ME,
      trx
    )
    return get(customFieldResult, `values.${ExtensionNamespace.CHAT_WITH_ME}.inviterId`)
  }
}
