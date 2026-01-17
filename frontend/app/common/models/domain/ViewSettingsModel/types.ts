import { AnyMap, ImmutableMap } from 'common/types';
import { Id } from 'common/utils/identifier';
import { List, Map } from 'immutable';
import { TypedRecord } from 'typed-immutable-record';
import {
  OverwatchTileViewSettingsRecordInterface,
  OverwatchViewSettingsRecordInterface,
} from '../OverwatchModel/types';

export type ViewFiltersType = AnyMap;

export enum ViewSettingsViewType {
  OVERWATCH = 'overwatch',
  TIMELINE = 'timeline',
  BOARD = 'board',
  CHAT = 'chat',
  MY_TASKS = 'myTasks',
  SCHEDULE = 'schedule',
}

export enum ViewContainerType {
  ORGANIZATION = 'organization',
  PROJECT = 'project',
  TASK = 'task',
  OVERWATCH_SPACE_TILE = 'overwatchSpaceTile',
  CONVERSATION = 'conversation',
  MY_TASKS = 'myTasks',
  SCHEDULE = 'schedule',
}

export interface ViewSettingsInterface {
  id: Id;
  containerType: ViewContainerType;
  containerId: Id;
  viewType: ViewSettingsViewType;
  createdAt?: number;
  updatedAt?: number;
}

export interface ViewSettingsRecordInterface
  extends TypedRecord<ViewSettingsRecordInterface>,
    ViewSettingsInterface {}

export type ViewSettingsData = Map<Id, ViewSettingsRecordInterface>;

export type ViewSettingsBodyType =
  | OverwatchViewSettingsRecordInterface
  | OverwatchTileViewSettingsRecordInterface;

export type ViewSettingsWithSettingsBody<TBody> = {
  viewSettings: ViewSettingsRecordInterface;
  viewSettingsBody: TBody;
};

export interface ViewSettingsState extends ImmutableMap<string, any> {
  viewSettingsData: ViewSettingsData;
  viewSettingsBody: Map<Id, ViewSettingsBodyType>;
  viewSettingsLinks: Map<Id, List<Id>>;
  baseViewSettingsIdByLinkedViewSettingsId: Map<Id, Id>;
}
