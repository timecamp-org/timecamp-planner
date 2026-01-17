import { EntityType } from '../common/enum';

export const DEFAULT_ENTITIES_PAGINATION_COLUMNS = ['createdAt', 'id'];

export const PAGINATION_COLUMNS_BY_ENTITY_TYPE = {
  [EntityType.Message]: ['createdAt', 'id'],
  [EntityType.Project]: ['name', 'id'],
  [EntityType.User]: ['createdAt', 'id'],
  [EntityType.File]: ['name', 'tbn.id'],
  [EntityType.Task]: ['createdAt', 'tbn.id'],
};

export const ORDER_BY_COLUMN_BY_ENTITY_TYPE = {
  [EntityType.Message]: 'created_at',
  [EntityType.Project]: 'start_date',
  [EntityType.User]: 'created_at',
  [EntityType.Task]: 'a.created_at',
  [EntityType.File]: 'tbn.created_at',
};

export const DEFAULT_SEARCH_ORDER_BY_OPTIONS = {
  column: 'createdAt',
  order: 'desc',
  nulls: 'last',
};
