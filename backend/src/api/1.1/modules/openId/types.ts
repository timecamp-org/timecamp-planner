import { UserDbRow } from "../db/schema";
import { OpenIdProviderCode } from "../common/enum";
import { Id } from "../common/identifier";

export enum CreateUserFromTokenResultStatus {
  OK, INVALID_ID_TOKEN, EMAIL_TAKEN, OPENID_ALREADY_EXISTS
}

export enum CreateOAuthUserBindingResultStatus {
  OK, OPENID_ALREADY_EXISTS
}

export enum GetUserFromTokenResultStatus {
  OK, INVALID_ID_TOKEN, USER_NOT_FOUND, OPENID_ALREADY_EXISTS, ACCOUNT_DELETED
}

export interface CreateUserFromTokenResult {
  status: CreateUserFromTokenResultStatus,
  user?: Partial<UserDbRow>
}

export interface CreateOAuthUserBindingResult {
  status: CreateOAuthUserBindingResultStatus,
}

export interface GetUserFromTokenResult {
  status: GetUserFromTokenResultStatus,
  user?: Partial<UserDbRow>
}

export interface OAuthUserBinding {
  userId: Id,
  providerCode: OpenIdProviderCode,
  subjectId: string,
}

export interface OpenIdSubjectInterface {
  subjectId: string,
  email: string,
  name: string,
  providerCode: OpenIdProviderCode,
}

export interface SigningKeyInterface {
  rsaPublicKey: string,
  kid: string,
  nbf: string,
}

export interface TokenHeader {
  alg: string,
  kid: string,
}

export enum ValidatedSubjectResultStatus {
  OK, INVALID_ID_TOKEN
}

export interface ValidatedSubjectResult {
  status: ValidatedSubjectResultStatus,
  subject?: OpenIdSubjectInterface
}

export interface OpenIdConnectConfigInterface {
  jwksUri: string,
  clientId: string,
}
