import { OAuth1ClientProviderInterface } from "../interfaces/OAuth1ClientProviderInterface";
import Table from "../../db/Table";
import { injectable, inject } from "inversify";
import { OAuth1ClientDbRow, OAuth1AuthorizedApplication, ApplicationNameByClientId } from "../types";
import { Id } from "../../common/identifier";
import { DbModule } from "../../db/DbModule";
import { ConnectionInterface } from "../../db/ConnectionInterface";

@injectable()
export class OAuth1ClientProvider implements OAuth1ClientProviderInterface {

  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {}

  async getClientByApplicationName(applicationName: OAuth1AuthorizedApplication): Promise<OAuth1ClientDbRow> {
    return await this.connection.getQueryBuilder()
      .select()
      .from(Table.OAUTH1_CLIENT)
      .where({ applicationName })
      .first()
  }

  async getApplicationNamesByIds(ids: Id[]): Promise<ApplicationNameByClientId> {
    const aplicationNameByClientId = {}
    const clientIdAndApplicationNames: Partial<OAuth1ClientDbRow>[] = await this.connection.getQueryBuilder()
      .select('id', 'applicationName')
      .from(Table.OAUTH1_CLIENT)
      .whereIn('id', ids)

    clientIdAndApplicationNames.forEach(clientIdAndApplicationName => {
      aplicationNameByClientId[clientIdAndApplicationName.id] = clientIdAndApplicationName.applicationName
    })

    return aplicationNameByClientId
  }

}
