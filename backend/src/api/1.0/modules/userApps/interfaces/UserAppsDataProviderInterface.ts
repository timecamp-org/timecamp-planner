
import { AppDbRow, UserInAppDbRow } from "../../db/schema";
import { Id } from "../../common/identifier";
import { AppWithClientInterface, UsersInApps } from "../types";

export interface UserAppsDataProviderInterface {
  getAppById(appId: Id, trx?: Transaction): PromiseLike<AppDbRow>;

  createApp(appJson: Partial<AppDbRow>, trx?: Transaction): PromiseLike<AppDbRow>;

  removeApp(appId: Id, trx?: Transaction): PromiseLike<void>;

  getAppMembers(appId: Id, trx?: Transaction): PromiseLike<UserInAppDbRow[]>;

  addAppMember(userInApp: Partial<UserInAppDbRow>, trx?: Transaction): PromiseLike<void>;

  removeAppMember(appId: Id, userId: Id, trx?: Transaction): PromiseLike<void>;

  getUserApps(userId: Id, trx?: Transaction): PromiseLike<AppWithClientInterface[]>;

  getUsersInApps(appIds: Id[], trx?: Transaction): PromiseLike<UsersInApps>;

  getUserInApp(appId: Id, userId: Id, trx?: Transaction): PromiseLike<UserInAppDbRow>;

  isUserAppMember(appId: Id, userId: Id, trx?: Transaction): PromiseLike<boolean>;
}
