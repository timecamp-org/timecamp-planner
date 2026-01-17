import { Id } from "../../common/identifier";
import { ApiKeyAndSecret } from "../types";

export interface OAuth1ApiKeyProviderInterface {

  createApiKeyAndSecret(
    organizationId: Id,
    userId: Id,
    clientId: Id,
    apiKey: string,
    secret: string,
  ): Promise<void>;

  getApiKeyAndSecret(
    organizationId: Id,
    userId: Id,
    clientId: Id,
  ): Promise<ApiKeyAndSecret>

  updateApiKeyAndSecret(
    organizationId: Id,
    userId: Id,
    clientId: Id,
    apiKey: string,
    secret: string,
  ): Promise<void>

  createOrUpdateApiKeyAndSecret(
    organizationId: Id,
    userId: Id,
    clientId: Id,
    apiKey: string,
    secret: string,
  ): Promise<void>

}
