import { TaskDbRow, OrganizationDbRow, ProjectDbRow } from '../db/schema'
import { Id } from "../common/identifier";
import { AnyDict } from "../common/types";
import { Response } from "express";
import { TasksChecklistItemsMap } from '../checklist/types'

export enum ExportDataType {
  CARD_DUE_DATES = 'cardDueDates',
  BOARD_CARDS = 'boardCards',
}

export enum ExportOutputFormat {
  ICAL = 'ical',
  CSV = 'csv',
}

export enum ExportDataStatus {
  OK,
  EXPORT_MODULE_NOT_FOUND,
  NOT_PERMITTED,
}

export enum GetContextStatus {
  OK,
  OBJECT_NOT_FOUND,
  UNRECOGNIZED_DATA_TYPE,
}

export type ExportDataResult = {
  status: ExportDataStatus,
  result?: any,
  responseHandler?: (res: Response, result: ExportData) => void,
}

export type GetContextResult<T> = {
  status: GetContextStatus,
  data?: T,
}

export type ICalCalendarData = {
  name: string,
  company: string,
  product: string,
}

export type ICalCalendarEventData = {
  start: Date,
  end: Date,
  title: string,
  description: string,
  allDay: boolean,
}

export type CalendarExportContex = {
  tasks: TaskDbRow[],
  organization: OrganizationDbRow
}

export type CalendarParams = {
  userInOrganizationId: Id, 
  key: string,
}

export type ExportData = AnyDict;

export enum ExporterType {
  CALENDAR_EXPORTER = 'CalendarExporter',
  BOARD_CARDS_EXPORTER = 'BoardCardsExporter',
}

export type Constructor<T> = {
  new(): T
}

export type BoardCardsParams = {
  organizationId,
  userId: Id,
  projectId: Id,
  exportArchivedCards: boolean,
}

export type BoardCardsExportResult = {
  filename: string,
  csv: string,
}

export type ListNamesByListIds = {
  [listId: string]: string
}

export type BoardCardsContext = {
  tasks: Partial<TaskDbRow>[],
  listNamesByListIds: ListNamesByListIds,
  project: ProjectDbRow,
  tagsDataByTaskIds: any,
  boardTaskAssigneeEmailsMap: BoardTaskAssigneeEmailsMap,
  taskEstimates: TaskEstimatesMap,
  tasksChecklistItems: TasksChecklistItemsMap,
}

export type TaskEstimatesMap = {
  [id: string]: number,
}

export type BoardTaskAssigneeEmailsMap = {
  [taskId: string]: string[]
}
