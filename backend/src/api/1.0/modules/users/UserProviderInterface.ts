import { QueryModifier } from '../../../../services/types';
import { PublicUserDbRow, UserDbRow } from '../db/schema';
import { Id } from '../common/identifier';

export interface UserProviderInterface {
  /**
   * @return {Promise<Partial<UserDbRow>[]>>}
   * @param decorate
   */
  getUsersForQuery(
    decorate: QueryModifier,
    trx?: Transaction,
    columnNames?: string[]
  ): PromiseLike<PublicUserDbRow[]>;

  /**
   * @param {Id[]} userIds
   * @return {Promise<Id[]>}
   */
  filterOutBots(userIds: Id[], trx?: Transaction): Promise<Id[]>;

  /**
   * @param {Id} id
   * @return {Promise<UserDbRow>}
   * */
  getUserById(id: Id, trx?: Transaction): PromiseLike<UserDbRow>;

  /**
   * @param {Id} id
   * @return {Promise<UserDbRow>}
   * */
  getUserByEmail(email: string, trx?: Transaction): PromiseLike<UserDbRow>;

  getUsersEmails(userIds: Id[]): PromiseLike<Record<Id, string>>;
}
