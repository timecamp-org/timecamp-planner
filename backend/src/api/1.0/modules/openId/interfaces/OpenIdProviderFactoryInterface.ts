import { OpenIdProviderInterface } from "./OpenIdProviderInterface";

export interface OpenIdProviderFactoryInterface {
  getProviderKey(issuer: string): string;
  getProvider(providerKey: string): OpenIdProviderInterface;
}
