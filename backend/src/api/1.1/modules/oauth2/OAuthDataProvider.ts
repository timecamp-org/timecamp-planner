import { OAuthDataProviderInterface } from "./interfaces/OAuthDataProviderInterface";
import { OAuthAccessTokenDbRow, OAuthRefreshTokenDbRow, OAuthClientDbRow, OAuthAuthorizationCodeDbRow } from "../db/schema";

import Table from "../db/Table";
import { injectable, inject } from "inversify";
import { OAuthAuthorizationCode, OAuth2ClientJson } from "./types";
import { first } from 'lodash'
import { Id } from "../common/identifier";
import { DbModule } from "../db/DbModule";
import { ConnectionInterface } from "../db/ConnectionInterface";

@injectable()
export class OAuthDataProvider implements OAuthDataProviderInterface {

  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {}

  async getAccessToken(bearerToken: string, trx?: Transaction): Promise<OAuthAccessTokenDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .select()
      .from(Table.OAUTH_ACCESS_TOKEN)
      .where('accessToken', bearerToken)
      .first()
  }

  async createAccessToken(accessToken: string, clientId: string, userId: string, expiresAt: Date, scope: string, trx?: Transaction): Promise<OAuthAccessTokenDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    const result = await query
      .into(Table.OAUTH_ACCESS_TOKEN)
      .insert({
        accessToken,
        clientId,
        userId,
        expiresAt,
        scope
      })
      .returning(`*`)
    return first(result)
  }

  async getRefreshToken(bearerToken: string, trx?: Transaction): Promise<OAuthRefreshTokenDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .select()
      .from(Table.OAUTH_REFRESH_TOKEN)
      .where('refreshToken', bearerToken)
      .first()
  }

  async deleteRefreshToken(bearerToken: string, trx?: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .from(Table.OAUTH_REFRESH_TOKEN)
      .where('refreshToken', bearerToken)
      .del()
  }

  async createRefreshToken(refreshToken: string, clientId: string, userId: string, expiresAt: Date, scope: string, trx?: Transaction): Promise<OAuthRefreshTokenDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    const result = await query
      .into(Table.OAUTH_REFRESH_TOKEN)
      .insert({
        refreshToken,
        clientId,
        userId,
        expiresAt,
        scope
      })
      .returning(`*`)
    return first(result)
  }

  async createAuthorizationCode(code: OAuthAuthorizationCode, clientId: string, userId: string, trx?: Transaction): Promise<OAuthAuthorizationCodeDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    const result = await query
      .into(Table.OAUTH_AUTHORIZATION_CODE)
      .insert({
        authorizationCode: code.authorizationCode,
        clientId,
        userId,
        expiresAt: code.expiresAt,
        scope: code.scope,
        redirectUri: code.redirectUri,
      })
      .returning(`*`)
    return first(result)
  }

  async getAuthorizationCode(authorizationCode: string, trx?: Transaction): Promise<OAuthAuthorizationCodeDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .select()
      .from(Table.OAUTH_AUTHORIZATION_CODE)
      .where({ authorizationCode })
      .first()
  }

  async deleteAuthorizationCode(authorizationCode: string, trx?: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .from(Table.OAUTH_AUTHORIZATION_CODE)
      .where({ authorizationCode })
      .delete()
  }

  async getClient(clientId: string, clientSecret?: string, trx?: Transaction): Promise<OAuthClientDbRow> {
    let query = this.connection.getQueryWithTransaction(trx)
      .select()
      .from(Table.OAUTH_CLIENT)
      .where({ id: clientId })
      .first()

    if (clientSecret) {
      query = query.andWhere({ clientSecret })
    }
    return await query
  }

  async createClient(client: OAuth2ClientJson, trx?: Transaction): Promise<OAuthClientDbRow> {
    let query = this.connection.getQueryWithTransaction(trx)
    const result = await query
      .insert(client)
      .into(Table.OAUTH_CLIENT)
      .returning('*')

    return first(result)
  }

  async updateClient(clientId: Id, client: OAuth2ClientJson, trx?: Transaction): Promise<OAuthClientDbRow> {
    let query = this.connection.getQueryWithTransaction(trx)
    const result = await query
      .update(client)
      .from(Table.OAUTH_CLIENT)
      .where({ id: clientId })
      .returning('*')

    return first(result)
  }

  async removeClient(clientId: Id, trx?: Transaction): Promise<void> {
    let query = this.connection.getQueryWithTransaction(trx)
    await query
      .delete()
      .from(Table.OAUTH_CLIENT)
      .where({ id: clientId })
  }
}
