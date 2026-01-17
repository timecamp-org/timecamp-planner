import { Id } from "../../common/identifier";
import { UserStatusJson } from "../types";
import { UserStatusDbRow } from "../../db/schema";


export interface UserStatusProviderInterface {

  getOrganizationUserStatuses(organizationId: Id, trx?: Transaction): PromiseLike<UserStatusDbRow[]>;

  getUserStatus(userId: Id, organizationId: Id, trx?: Transaction): PromiseLike<UserStatusDbRow>;

  setUserStatus(userStatusJson: UserStatusJson, trx?: Transaction): PromiseLike<UserStatusDbRow>;

  updateUserStatus(userStatusJson: UserStatusJson, trx?: Transaction): PromiseLike<UserStatusDbRow>;

  deleteUserStatus(userId: Id, organizationId: Id, trx?: Transaction): PromiseLike<void>;
  
  getStatusIdsWithResetUntil(resetAt: Date): PromiseLike<Id[]>;

  deleteUserStatuses(ids: Id[]): PromiseLike<void>;
}
