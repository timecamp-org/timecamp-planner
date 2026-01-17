import { Id } from "../../common/identifier";
import { OAuth1RequestTokenAndSecret } from "../types";

export interface OAuth1RequestTokenProviderInterface {

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
  ): Promise<OAuth1RequestTokenAndSecret>

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

}
