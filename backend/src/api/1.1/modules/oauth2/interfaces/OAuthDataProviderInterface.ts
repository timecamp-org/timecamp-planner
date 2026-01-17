import { OAuthAccessTokenDbRow, OAuthRefreshTokenDbRow, OAuthClientDbRow, OAuthAuthorizationCodeDbRow } from "../../db/schema";

import { OAuthAuthorizationCode, OAuth2ClientJson } from "../types";
import { Id } from "../../common/identifier";

export interface OAuthDataProviderInterface {

  getAccessToken(bearerToken: string, trx?: Transaction): PromiseLike<OAuthAccessTokenDbRow>;
  createAccessToken(accessToken: string, clientId: string, userId: string, expiresAt: Date, scope: string, trx?: Transaction): PromiseLike<OAuthAccessTokenDbRow>;

  getRefreshToken(bearerToken: string, trx?: Transaction): PromiseLike<OAuthRefreshTokenDbRow>;
  createRefreshToken(refreshToken: string, clientId: string, userId: string, expiresAt: Date, scope: string, trx?: Transaction): PromiseLike<OAuthRefreshTokenDbRow>;
  deleteRefreshToken(refreshToken: string, trx?: Transaction): PromiseLike<void>;

  getAuthorizationCode(code: string, trx?: Transaction): PromiseLike<OAuthAuthorizationCodeDbRow>;
  createAuthorizationCode(code: OAuthAuthorizationCode, clientId: string, userId: string, trx?: Transaction): PromiseLike<OAuthAuthorizationCodeDbRow>;
  deleteAuthorizationCode(authorizationCode: string, trx?: Transaction): PromiseLike<void>;

  getClient(clientId: string, clientSecret?: string, trx?: Transaction): PromiseLike<OAuthClientDbRow>;
  createClient(clientJson: OAuth2ClientJson, trx?: Transaction): PromiseLike<OAuthClientDbRow>;
  updateClient(clientId: Id, clientJson: OAuth2ClientJson, trx?: Transaction): PromiseLike<OAuthClientDbRow>;
  removeClient(clientId: Id, trx?: Transaction): PromiseLike<void>;
}
