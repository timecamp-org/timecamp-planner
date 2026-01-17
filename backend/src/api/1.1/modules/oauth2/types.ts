import { OAuthClientDbRow } from "../db/schema";

export enum OAuthGrant {
  AUTHORIZATION_CODE = 'authorization_code',
  PASSWORD = 'password',
  REFRESH_TOKEN = 'refresh_token',
  CLIENT_CREDENTIALS = 'client_credentials'
}

export enum OAuthScope {
  HEYSPACE = 'heyspace', // permission to all resources,
  HEYSPACE_USER = 'heyspace.user' // premission to user resources
  // TODO: implement scopes
}

export interface OAuthAuthorizationCode {
  authorizationCode: string,
  expiresAt: Date,
  redirectUri: string,
  scope: string | string[],
}

export enum GetBasicClientDataStatus {
  OK,
  OAUTH_CLIENT_NOT_FOUND,
}

export interface GetBasicClientDataResult {
  status: GetBasicClientDataStatus,
  client?: Partial<OAuthClientDbRow>,
}

export enum RegenerateClientSecretStatus {
  OK,
  OAUTH_CLIENT_NOT_FOUND,
}

export interface RegenerateClientSecretResult {
  status: RegenerateClientSecretStatus,
  clientSecret?: string,
}

export type OAuth2ClientJson = Partial<OAuthClientDbRow>
