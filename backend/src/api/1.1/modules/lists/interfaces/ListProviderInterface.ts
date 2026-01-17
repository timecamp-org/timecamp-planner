import { ListDbRow, TaskDbRow } from '../../db/schema';
import { Id } from '../../common/identifier';

import { UpdateListJson, CreateListJson } from '../types';
import { QueryModifier } from '../../../../../services/types';

export interface ListProviderInterface {

  getList(id: Id, trx?: Transaction): PromiseLike<ListDbRow>;

  getLists(listIds: Id[]): PromiseLike<ListDbRow[]>;

  createList(listJson: CreateListJson, trx?: Transaction): PromiseLike<ListDbRow>;

  updateList(id: Id, listJson: UpdateListJson, trx?: Transaction): PromiseLike<number>;

  getListTasks(listId: Id, trx?: Transaction, decorate?: QueryModifier): Promise<TaskDbRow[]>

  getListsTaskIds(ids: Id[], trx?: Transaction): Promise<Id[]>;

  getProjectLists(projectId: Id, trx?: Transaction, decorate?: QueryModifier): Promise<ListDbRow[]>

  getListsByIds(listIds: Id[]): Promise<ListDbRow[]>;

  createLists(lists: ListDbRow[], trx?: Transaction): Promise<void>;

  getFirstVisibleTaskListId(projectId: Id): PromiseLike<Id>;
}
