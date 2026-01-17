import { UserDbRow } from "../db/schema";

export enum AppleAuthenticationStatus {
  OK,
  INVALID_ID_TOKEN,
  USER_NOT_FOUND
}

export interface AppleAuthenticationResult {
  status: AppleAuthenticationStatus,
  user?: UserDbRow,
}

export enum CreateUserFromAppleTokenStatus {
  OK, 
  INVALID_ID_TOKEN, 
  EMAIL_TAKEN,
}


export interface CreateUserFromAppleTokenResult {
  status: CreateUserFromAppleTokenStatus,
  user?: Partial<UserDbRow>
}