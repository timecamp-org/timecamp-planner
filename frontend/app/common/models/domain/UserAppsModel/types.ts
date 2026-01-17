import { ImmutableMap } from "../../../types";
import { Id } from "../../../utils/identifier";
import { OAuth2ClientInterfacfe } from "../OAuthModel/types";
import { List } from "immutable";
import { UserInterface } from "../UsersModel/types";

export interface UserAppInterface {
  clientName: string,
  clientThumbnailUrl: string,
  clientRedirectUris: string,
}

export interface UserAppsState extends ImmutableMap<string, any> {
  oAuthClientIdByAppId: Map<Id, Id>,
  appUserIds: Map<Id, List<Id>>,
  appUsersRole: Map<Id, Map<Id, AppUserRole>>,
}

export interface AppWithClientInterface {
  id: Id,
  oAuthClient: OAuth2ClientInterfacfe,
}

export enum AppUserRole {
  OWNER = 'owner',
  COLLABORATOR = 'collaborator'
}

export interface UserInAppInterface {
  appId: Id,
  userId: Id,
  role: AppUserRole,
}

export interface UserInAppEntity {
  app: UserAppInterface,
  appMembers: UserInAppInterface[],
  users: UserInterface[],
  oAuthClient: OAuth2ClientInterfacfe,
  appId: Id,
  userId: Id,
}
