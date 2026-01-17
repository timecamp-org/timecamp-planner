export type Id = string;

export type Dict<T> = { [_: string]: T };
export type AnyDict = Dict<any>;

export interface LoggerInterface {
  log: (message: string, error?: Error) => void;
  error: (error: Error) => void;
}

export enum UserContextEvents {
  USER_CHANGED = 'user-changed',
  SUBSCRIPTION_CHANGED = 'subscription-changed',
  ORGANIZATION_CHANGED = 'organization-changed',
  USER_ORGANIZATIONS_CHANGED = 'user-organizations-changed',
  USER_ROLE_CHANGED = 'user-role-changed',
}
