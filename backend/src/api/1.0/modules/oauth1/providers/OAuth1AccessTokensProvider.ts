import { OAuth1AccessTokenProviderInterface } from "../interfaces/OAuth1AccessTokenProviderInterface";
import Table from "../../db/Table";
import { injectable, inject } from "inversify";
import { Id } from "../../common/identifier";
import { OAuth1AccessTokenAndSecret, OAuth1AccessTokenDbRow } from "../types";
import { ConnectionInterface } from "../../db/ConnectionInterface";
import { DbModule } from "../../db/DbModule";

@injectable()
export class OAuth1AccessTokenProvider implements OAuth1AccessTokenProviderInterface {

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
      .into(Table.OAUTH1_ACCESS_TOKEN)
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
  ): Promise<OAuth1AccessTokenAndSecret> {
    const accessTokenDbRow: OAuth1AccessTokenDbRow = await this.connection.getQueryBuilder()
      .select()
      .from(Table.OAUTH1_ACCESS_TOKEN)
      .where({ organizationId, userId, clientId })
      .first()

    return {
      accessToken: accessTokenDbRow ? accessTokenDbRow.token : null,
      accessTokenSecret: accessTokenDbRow ? accessTokenDbRow.secret : null,
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
      .table(Table.OAUTH1_ACCESS_TOKEN)
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
    const { accessToken, accessTokenSecret } = await this.getTokenAndSecret(organizationId, userId, clientId)
    if (accessToken && accessTokenSecret) {
      return await this.updateTokenAndSecret(organizationId, userId, clientId, token, secret)
    }

    return await this.createTokenAndSecret(organizationId, userId, clientId, token, secret)
  }

  async getClientIdsWithAccessToken(
    organizationId: Id,
    userId: Id,
  ): Promise<string[]> {
    const clientIdRows: Partial<OAuth1AccessTokenDbRow>[] = await this.connection.getQueryBuilder()
      .select('clientId')
      .from(Table.OAUTH1_ACCESS_TOKEN)
      .where({ organizationId, userId })

    return clientIdRows.map(clientIdRow => clientIdRow.clientId)
  }

  async removeTokenAndSecret(
    organizationId: Id,
    userId: Id,
    clientId: Id,
  ): Promise<void> {
    await this.connection.getQueryBuilder()
      .table(Table.OAUTH1_ACCESS_TOKEN)
      .where({
        organizationId,
        userId,
        clientId,
      })
      .del()
  }

}
