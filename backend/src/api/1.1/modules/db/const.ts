import { EntityType } from '../common/enum';
import Table from './Table';

export const ENTITY_TO_TABLE_MAPPING = {
  [EntityType.Project]: Table.PROJECT,
  [EntityType.User]: Table.USER,
  [EntityType.Task]: Table.TASK,
  [EntityType.Message]: Table.MESSAGE,
  [EntityType.File]: Table.FILE,
};
