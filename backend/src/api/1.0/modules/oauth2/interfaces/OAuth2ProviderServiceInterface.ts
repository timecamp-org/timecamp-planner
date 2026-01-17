import { GetBasicClientDataResult, RegenerateClientSecretResult } from "../types";
import { Id } from "../../common/identifier";

export interface OAuth2ProviderServiceInterface {
  getBasicClientData(clientId: Id): PromiseLike<GetBasicClientDataResult>;
  regenerateClientSecret(clientId: Id): PromiseLike<RegenerateClientSecretResult>;
  generateClientSecret(): string;
}
