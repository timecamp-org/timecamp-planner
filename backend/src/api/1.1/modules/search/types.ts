import { EntityType } from '../common/enum';
import { Id } from '../common/identifier';
import { MessageDbRow } from '../db/schema';
import { PaginatedResults } from '../pagination/types';

export enum SearchMessageStatus {
  OK,
  MESSAGE_NOT_FOUND,
}

export interface SearchMessageResult {
  status: SearchMessageStatus;
  results?: PaginatedResults<MessageDbRow>;
}

export type SearchEntitiesPropsType = {
  searchPhrase: string;
  page: string;
  limit: number;
  entityType: EntityType;
  organizationId: Id;
  archived: boolean;
  userId: Id;
};
