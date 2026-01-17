import { UserDbRow, ChangedPropertyInterface } from "../../db/schema";
import { ChainableContextInterface } from "../interfaces/ChainableContextInterface";
import { NotificationContent } from "../types";
import UserService from "../../users/UserService";

/**
 * Helper type.
 */
export class Actor {
  public user: UserDbRow;

  constructor(user: UserDbRow) {
    this.user = user
  }

  getDisplayName() {
    return UserService.getUserFullName(this.user);
  }
}


export type PromiseAllArgument = Iterable<{} | PromiseLike<{}>>;

export type ChainElementParameterResolver =
  (ctx: ChainableContextInterface) => PromiseAllArgument;

export type ChainElementRenderer<T extends NotificationContent> =
  (...args: any[]) => PromiseLike<T>;

export type ChainElementFilter = (ctx: ChainableContextInterface) => boolean;

export type ChangedPropertyPredicate = (changedProperty: ChangedPropertyInterface) => boolean;
