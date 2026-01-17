import { OAuth1RequestTokenProviderInterface } from "../interfaces/OAuth1RequestTokenProviderInterface";
import Table from "../../db/Table";
import { injectable, inject } from "inversify";
import { Id } from "../../common/identifier";
import { OAuth1RequestTokenAndSecret, OAuth1RequestTokenDbRow } from "../types";
import { DbModule } from "../../db/DbModule";
import { ConnectionInterface } from "../../db/ConnectionInterface";

@injectable()
export class OAuth1RequestTokenProvider implements OAuth1RequestTokenProviderInterface {

  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {}

  async createTokenAndSecret(
    organizationId: Id,
    userId: Id,
    clientId: Id,
    token: string,
    secret: string,
  ): Promise<void> {
    await this.connection.getQueryBuilder()
      .into(Table.OAUTH1_REQUEST_TOKEN)
      .insert({
        organizationId,
        userId,
        clientId,
        token,
        secret,
      })
  }

  async getTokenAndSecret(
    organizationId: Id,
    userId: Id,
    clientId: Id,
  ): Promise<OAuth1RequestTokenAndSecret> {
    const requestTokenDbRow: OAuth1RequestTokenDbRow = await this.connection.getQueryBuilder()
      .select()
      .from(Table.OAUTH1_REQUEST_TOKEN)
      .where({ organizationId, userId, clientId })
      .first()

    return {
      requestToken: requestTokenDbRow ? requestTokenDbRow.token : null,
      requestTokenSecret: requestTokenDbRow ? requestTokenDbRow.secret : null,
    }
  }

  async updateTokenAndSecret(
    organizationId: Id,
    userId: Id,
    clientId: Id,
    token: string,
    secret: string,
  ): Promise<void> {
    await this.connection.getQueryBuilder()
      .table(Table.OAUTH1_REQUEST_TOKEN)
      .where({
        organizationId,
        userId,
        clientId,
      })
      .update({ token, secret })
  }

  async createOrUpdateTokenAndSecret(
    organizationId: Id,
    userId: Id,
    clientId: Id,
    token: string,
    secret: string,
  ): Promise<void> {
    const { requestToken, requestTokenSecret } = await this.getTokenAndSecret(organizationId, userId, clientId)
    if (requestToken && requestTokenSecret) {
      return await this.updateTokenAndSecret(organizationId, userId, clientId, token, secret)
    }

    return await this.createTokenAndSecret(organizationId, userId, clientId, token, secret)
  }

}
