import { Id } from "../../../utils/identifier";
import { ImmutableMap } from "../../../types";
import { List } from "immutable";

export interface TaskListInterface {
  id: Id,
  projectId: Id,
  order: number,
  name: string,
  isArchived: boolean,
  creatorId?: Id,
}

export interface TaskListsState extends ImmutableMap<string, any> {
  projectIdsByListIds: Map<Id, Id>,
  projectIdsByListIdsChangedAt: Map<Id, Date>,
  listIdsOrderByProject: Map<Id, Map<Id, number>>,
  listNames: Map<Id, string>,
  listIsArchivedStatuses: Map<Id, boolean>,
  tasksOrderByListId: Map<Id, Map<Id, number>>,
  listIdByTaskId: Map<Id, Id>,
  listIdByTaskIdChangedAt: Map<Id, Date>,
  listFollowers: Map<Id, List<Id>>,
  listLimits: Map<Id, number>,
}

export interface CreateListInterface {
  id: Id,
  name: string,
  projectId: Id,
  destinationListId?: Id,
  createBelowDestination?: boolean,
  createAtTheBottom?: boolean,
  createAtTheTop?: boolean,
}