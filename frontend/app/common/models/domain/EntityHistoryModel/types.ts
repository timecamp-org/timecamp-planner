import { Map } from "immutable";
import { EntityType } from "../EntityModel/types";
import { Id } from "../../../utils/identifier";
import { ImmutableMap } from "../../../types";

export type EntityHistory = Map<string, number>

export type EntityWithHistory<T> = T & {
  entityHistory: EntityHistory
}

export interface EntityHistoryState extends ImmutableMap<string, any> {
  entityHistory: Map<EntityType, Map<Id, EntityHistory>>,
}