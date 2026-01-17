import { Id } from 'common/utils/identifier'

export enum BadgeNotificationType {
  CONVERSATION = 'CONVERSATION',
  ALL = 'ALL',
  PROJECT = 'PROJECT',
  PROJECT_GROUP = 'PROJECT_GROUP',
  WORKSPACE = 'WORKSPACE',
  TASK = 'TASK',
  STANDALONE = 'STANDALONE'
}

export enum BadgeContainerType {
  SPACE = 'SPACE',
  CONVERSATION = 'CONVERSATION'
}

export type BadgeComponentRefSetter = (
  objectId: Id,
  counter: number,
  innerRef: HTMLDivElement,
  badgeContainerType: BadgeContainerType
) => void

export type BadgeComponentRefRemover = (objectId: Id) => void
