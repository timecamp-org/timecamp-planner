import { OAuth1ApiKeyProviderInterface } from "../interfaces/OAuth1ApiKeyProviderInterface";
import Table from "../../db/Table";
import { injectable, inject } from "inversify";
import { Id } from "../../common/identifier";
import { ApiKeyAndSecret, OAuth1ApiKeyDbRow } from "../types";
import { ConnectionInterface } from "../../db/ConnectionInterface";
import { DbModule } from "../../db/DbModule";

@injectable()
export class OAuth1ApiKeyProvider implements OAuth1ApiKeyProviderInterface {

  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {}

  async createApiKeyAndSecret(
    organizationId: Id,
    userId: Id,
    clientId: Id,
    apiKey: string,
    secret: string,
  ): Promise<void> {
    await this.connection.getQueryBuilder()
      .into(Table.OAUTH1_API_KEY)
      .insert({
        organizationId,
        userId,
        clientId,
        apiKey,
        secret,
      })
  }

  async getApiKeyAndSecret(
    organizationId: Id,
    userId: Id,
    clientId: Id,
  ): Promise<ApiKeyAndSecret> {
    const apiKeyDbRow: OAuth1ApiKeyDbRow = await this.connection.getQueryBuilder()
      .select()
      .from(Table.OAUTH1_API_KEY)
      .where({ organizationId, userId, clientId })
      .first()

    return {
      apiKey: apiKeyDbRow ? apiKeyDbRow.apiKey : null,
      secret: apiKeyDbRow ? apiKeyDbRow.secret : null,
    }
  }

  async updateApiKeyAndSecret(
    organizationId: Id,
    userId: Id,
    clientId: Id,
    apiKey: string,
    secret: string,
  ): Promise<void> {
    await this.connection.getQueryBuilder()
      .table(Table.OAUTH1_API_KEY)
      .where({
        organizationId,
        userId,
        clientId,
      })
      .update({ apiKey, secret })
  }

  async createOrUpdateApiKeyAndSecret(
    organizationId: Id,
    userId: Id,
    clientId: Id,
    apiKey: string,
    secret: string,
  ): Promise<void> {
    const apiKeyAndSecret = await this.getApiKeyAndSecret(organizationId, userId, clientId)
    if (apiKeyAndSecret.apiKey && apiKeyAndSecret.secret) {
      return await this.updateApiKeyAndSecret(organizationId, userId, clientId, apiKey, secret)
    }

    return await this.createApiKeyAndSecret(organizationId, userId, clientId, apiKey, secret)
  }

}
