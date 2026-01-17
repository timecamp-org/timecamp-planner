import {
  UserAppJson,
  UpdateUserAppResult,
  GetUserAppsResult,
  CreateUserAppResult,
  CreateUserAppStatus,
  UpdateUserAppStatus,
  GetUserAppsStatus,
  DeleteUserAppResult,
  DeleteUserAppStatus,
  AddUserAppMemberResult,
  AddUserAppMemberStatus,
  RemoveUserAppMemberStatus,
  RemoveUserAppMemberResult,
  InviteUserAppMemberResult,
  InviteUserAppMemberStatus
} from "./types";
import { Id } from "../common/identifier";
import { injectable, inject } from "inversify";
import { OAuth2Module } from "../oauth2/OAuth2Module";
import { OAuthDataProviderInterface } from "../oauth2/interfaces/OAuthDataProviderInterface";
import { UserAppsDataProviderInterface } from "./interfaces/UserAppsDataProviderInterface";
import { OAuth2ClientJson, OAuthGrant } from "../oauth2/types";
import { UserInAppDbRow, AppUserRole } from "../db/schema";

import Table, { UniqueKey } from "../db/Table";
import { violatesUniqueKey } from "../../../../utils";
import { mergeAppWithOAuthClient } from "./utils";
import { OAuth2ProviderServiceInterface } from "../oauth2/interfaces/OAuth2ProviderServiceInterface";
import { UsersModule } from "../users/UsersModule";
import { UserProviderInterface } from "../users/UserProviderInterface";
import { uniqBy } from 'lodash'
import { UserAppsModule } from "./UserAppsModule";
import { UserAppsServiceInterface } from "./interfaces/UserAppsServiceInterface";
import { DbModule } from "../db/DbModule";
import { ConnectionInterface } from "../db/ConnectionInterface";

const DEFAULT_ACCESS_TOKEN_LIFETIME = 60 * 60 * 24 // 1 day
const DEFAULT_REFRESH_TOKEN_LIFETIME = 60 * 60 * 24 * 14 // 2 weeks

@injectable()
export class UserAppsService implements UserAppsServiceInterface {

  constructor(
    @inject(OAuth2Module.OAuthDataProviderInterface)
    private oAuth2DataProvider: OAuthDataProviderInterface,
    @inject(OAuth2Module.OAuth2ProviderServiceInterface)
    private oAuth2ProviderService: OAuth2ProviderServiceInterface,
    @inject(UserAppsModule.UserAppsDataProviderInterface)
    private appDataProvider: UserAppsDataProviderInterface,
    @inject(UsersModule.UserProviderInterface)
    private userProvider: UserProviderInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
  ) { }


  async createApp(userId: Id, appId: Id, appJson: UserAppJson): Promise<CreateUserAppResult> {
    return await this.connection.getConnection().transaction(async trx => {
      return await this.doCreateApp(trx, userId, appId, appJson)
    })
  }

  async doCreateApp(trx: Transaction, userId: Id, appId: Id, appJson: UserAppJson): Promise<CreateUserAppResult> {
    try {
      const clientSecret = this.oAuth2ProviderService.generateClientSecret()
      const oAuthClientJson: OAuth2ClientJson = {
        name: appJson.clientName,
        clientSecret,
        grants: `${OAuthGrant.AUTHORIZATION_CODE} ${OAuthGrant.REFRESH_TOKEN}`,
        accessTokenLifetime: DEFAULT_ACCESS_TOKEN_LIFETIME,
        refreshTokenLifetime: DEFAULT_REFRESH_TOKEN_LIFETIME,
      }
      const oAuthClient = await this.oAuth2DataProvider.createClient(oAuthClientJson, trx)
      const app = await this.appDataProvider.createApp({
        id: appId,
        oauthClientId: oAuthClient.id,
      }, trx)

      const appWithOAuthClient = mergeAppWithOAuthClient(app, oAuthClient)

      const userInApp: Partial<UserInAppDbRow> = {
        appId: app.id,
        role: AppUserRole.OWNER,
        userId,
      }
      await this.appDataProvider.addAppMember(userInApp, trx)

      return {
        status: CreateUserAppStatus.OK,
        app: appWithOAuthClient,
      }
    } catch (error) {
      if (violatesUniqueKey(error, UniqueKey.EXTENSION_APP_ID_PK)) {
        return { status: CreateUserAppStatus.APP_ALREADY_EXISTS }
      }
      throw error
    }
  }

  async updateApp(appId: Id, appJson: UserAppJson): Promise<UpdateUserAppResult> {
    return await this.connection.getConnection().transaction(async trx => {
      return await this.doUpdateApp(trx, appId, appJson)
    })
  }

  async doUpdateApp(trx: Transaction, appId: Id, appJson: UserAppJson): Promise<UpdateUserAppResult> {
    try {
      const app = await this.appDataProvider.getAppById(appId, trx)
      if (!app) {
        return {
          status: UpdateUserAppStatus.APP_NOT_FOUND
        }
      }
      const oAuthClientJson: OAuth2ClientJson = {
        name: appJson.clientName,
        redirectUris: appJson.clientRedirectUris,
        thumbnailUrl: appJson.clientThumbnailUrl,
      }
      const oAuthClient = await this.oAuth2DataProvider.updateClient(app.oauthClientId, oAuthClientJson, trx)

      const appWithOAuthClient = mergeAppWithOAuthClient(app, oAuthClient)

      return {
        status: UpdateUserAppStatus.OK,
        app: appWithOAuthClient,
      }
    } catch (error) {
      throw error
    }
  }

  async getUserApps(userId: Id): Promise<GetUserAppsResult> {
    const apps = await this.appDataProvider.getUserApps(userId)
    const appIds = apps.map(app => app.id)
    const usersInApps = await this.appDataProvider.getUsersInApps(appIds)
    let users = await this.userProvider.getUsersForQuery(
      q =>
        q
          .distinct(`${Table.USER}.*`)
          .join(
            Table.EXTENSION_USER_IN_APP,
            join => join
              .on(`${Table.USER}.id`, `${Table.EXTENSION_USER_IN_APP}.userId`)
          )
          .whereIn(`appId`, appIds)
    );
    users = uniqBy(users, user => user.id)
    return {
      status: GetUserAppsStatus.OK,
      apps,
      usersInApps,
      users,
    }
  }

  async deleteApp(appId: Id): Promise<DeleteUserAppResult> {
    return await this.connection.getConnection().transaction(async trx => {
      return await this.doDeleteApp(trx, appId)
    })
  }

  async doDeleteApp(trx: Transaction, appId: Id): Promise<DeleteUserAppResult> {
    const app = await this.appDataProvider.getAppById(appId, trx)
    if (!app) {
      return {
        status: DeleteUserAppStatus.APP_NOT_FOUND
      }
    }

    const oAuthClient = await this.oAuth2DataProvider.getClient(app.oauthClientId)
    if (!oAuthClient) {
      return {
        status: DeleteUserAppStatus.OAUTH_CLIENT_NOT_FOUND
      }
    }

    await this.appDataProvider.removeApp(appId, trx)
    await this.oAuth2DataProvider.removeClient(app.oauthClientId, trx)

    return {
      status: DeleteUserAppStatus.OK,
    }
  }

  async addAppMember(appId: Id, userId: Id, role: AppUserRole): Promise<AddUserAppMemberResult> {
    const app = await this.appDataProvider.getAppById(appId)
    if (!app) {
      return {
        status: AddUserAppMemberStatus.APP_NOT_FOUND
      }
    }

    const user = await this.userProvider.getUserById(userId)
    if (!user) {
      return {
        status: AddUserAppMemberStatus.USER_NOT_FOUND
      }
    }

    await this.appDataProvider.addAppMember({
      appId,
      userId,
      role
    })

    return {
      status: AddUserAppMemberStatus.OK
    }
  }

  async inviteAppMember(appId: Id, email: string, role: AppUserRole): Promise<InviteUserAppMemberResult> {
    const app = await this.appDataProvider.getAppById(appId)
    if (!app) {
      return {
        status: InviteUserAppMemberStatus.APP_NOT_FOUND
      }
    }

    const user = await this.userProvider.getUserByEmail(email)
    if (!user) {
      return {
        status: InviteUserAppMemberStatus.USER_NOT_FOUND
      }
    }

    await this.appDataProvider.addAppMember({
      appId,
      userId: user.id,
      role
    })

    return {
      status: InviteUserAppMemberStatus.OK,
      user,
    }
  }

  async removeAppMember(appId: Id, userId: Id): Promise<RemoveUserAppMemberResult> {
    const app = await this.appDataProvider.getAppById(appId)
    if (!app) {
      return {
        status: RemoveUserAppMemberStatus.APP_NOT_FOUND
      }
    }

    const user = await this.userProvider.getUserById(userId)
    if (!user) {
      return {
        status: RemoveUserAppMemberStatus.USER_NOT_FOUND
      }
    }

    await this.appDataProvider.removeAppMember(appId, userId)

    return {
      status: RemoveUserAppMemberStatus.OK
    }

  }


}
