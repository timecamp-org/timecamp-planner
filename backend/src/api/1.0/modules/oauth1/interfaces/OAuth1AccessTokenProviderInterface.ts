import { Id } from "../../common/identifier";
import { OAuth1AccessTokenAndSecret } from "../types";

export interface OAuth1AccessTokenProviderInterface {

  createTokenAndSecret(
    organizationId: Id,
    userId: Id,
    clientId: Id,
    token: string,
    secret: string,
  ): Promise<void>;

  getTokenAndSecret(
    organizationId: Id,
    userId: Id,
    clientId: Id,
  ): Promise<OAuth1AccessTokenAndSecret>

  updateTokenAndSecret(
    organizationId: Id,
    userId: Id,
    clientId: Id,
    token: string,
    secret: string,
  ): Promise<void>

  createOrUpdateTokenAndSecret(
    organizationId: Id,
    userId: Id,
    clientId: Id,
    token: string,
    secret: string,
  ): Promise<void>

  getClientIdsWithAccessToken(
    organizationId: Id,
    userId: Id,
  ): Promise<string[]>

  removeTokenAndSecret(
    organizationId: Id,
    userId: Id,
    clientId: Id,
  ): Promise<void>

}
