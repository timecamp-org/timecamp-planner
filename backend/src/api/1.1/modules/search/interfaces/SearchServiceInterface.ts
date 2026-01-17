import { EntityType } from '../../common/enum';
import { Id } from '../../common/identifier';
import { SearchEntitiesPropsType, SearchMessageResult } from '../types';

export type EntityPropsType = {
  entityType?: EntityType;
  archived?: boolean;
  searchPhrase: string;
  organizationId: Id;
  page?: string;
  limit?: number;
  userId: Id;
};

export interface SearchServiceInterface {
  searchEntities(props: SearchEntitiesPropsType): PromiseLike<SearchMessageResult>;
  handleSearchEntities(props: EntityPropsType): PromiseLike<any>;
}
