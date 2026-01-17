import { AppDbRow, UserInAppDbRow, OAuthClientDbRow } from '../db/schema';

import { Id } from '../common/identifier';
import Table from '../db/Table';
import { first, pick } from 'lodash'
import { injectable, inject } from 'inversify';
import { AppWithClientInterface, UsersInApps } from './types';
import { mergeAppWithOAuthClient } from './utils';
import { UserAppsDataProviderInterface } from './interfaces/UserAppsDataProviderInterface';
import { DbModule } from '../db/DbModule';
import { ConnectionInterface } from '../db/ConnectionInterface';

@injectable()
export class UserAppsDataProvider implements UserAppsDataProviderInterface {

  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
  ) {}

  async getAppById(appId: Id, trx?: Transaction): Promise<AppDbRow> {
    return await this.connection.getQueryWithTransaction(trx)
      .select()
      .from(Table.EXTENSION_APP)
      .where({ id: appId })
      .first()
  }

  async createApp(appJson: Partial<AppDbRow>, trx?: Transaction): Promise<AppDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    const result = await query
      .insert(appJson)
      .from(Table.EXTENSION_APP)
      .returning('*')

    return first(result)
  }

  async removeApp(appId: Id, trx?: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx)
    await query
      .delete()
      .from(Table.EXTENSION_APP)
      .where({ id: appId })
  }

  async getAppMembers(appId: Id, trx?: Transaction): Promise<UserInAppDbRow[]> {
    return await this.connection.getQueryWithTransaction(trx)
      .select()
      .from(Table.EXTENSION_USER_IN_APP)
      .where({ appId })
  }

  async addAppMember(userInApp: UserInAppDbRow, trx?: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .insert(userInApp)
      .from(Table.EXTENSION_USER_IN_APP)
  }

  async removeAppMember(appId: Id, userId: Id, trx?: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx)
    await query
      .delete()
      .from(Table.EXTENSION_USER_IN_APP)
      .where({ appId, userId })
  }

  async getUserApps(userId: Id, trx?: Transaction): Promise<AppWithClientInterface[]> {
    const apps = await this.connection.getQueryWithTransaction(trx)
      .select(`${Table.EXTENSION_APP}.*`)
      .from(Table.EXTENSION_APP)
      .join(Table.EXTENSION_USER_IN_APP, `${Table.EXTENSION_APP}.id`, `${Table.EXTENSION_USER_IN_APP}.appId`)
      .where({ [`${Table.EXTENSION_USER_IN_APP}.userId`]: userId })

    const oAuth2ClientIds = apps.map((app: AppDbRow) => app.oauthClientId)
    const oAuthClients: OAuthClientDbRow[] = await this.connection.getQueryWithTransaction(trx)
      .select()
      .from(Table.OAUTH_CLIENT)
      .whereIn('id', oAuth2ClientIds)

    const appsWithClients: AppWithClientInterface[] = apps.map((app: AppDbRow) => {
      const oAuthClient = oAuthClients.find(client => client.id === app.oauthClientId)
      return mergeAppWithOAuthClient(app, oAuthClient)
    })

    return appsWithClients
  }

  async getUsersInApps(appIds: Id[], trx?: Transaction): Promise<UsersInApps> {
    const query = this.connection.getQueryWithTransaction(trx)
    const result: UsersInApps = {}
    const usersInApps: UserInAppDbRow[] = await query
      .select()
      .from(Table.EXTENSION_USER_IN_APP)
      .whereIn('appId', appIds)

    usersInApps.forEach(userInApp => {
      if (!result[userInApp.appId]) {
        result[userInApp.appId] = []
      }
      result[userInApp.appId].push(pick(userInApp, ['userId', 'role']))
    })
    return result
  }

  async isUserAppMember(appId: Id, userId: Id, trx?: Transaction): Promise<boolean> {
    const userInApp = await this.getUserInApp(appId, userId, trx)
    return !!userInApp
  }

  async getUserInApp(appId: Id, userId: Id, trx?: Transaction): Promise<UserInAppDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    const results: UserInAppDbRow[] = await query
      .select()
      .from(Table.EXTENSION_USER_IN_APP)
      .where({ appId, userId })

    return first(results)
  }
}
