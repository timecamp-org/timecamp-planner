import * as C from './constants'
import { action } from 'typesafe-actions'
import { Id } from '../../../utils/identifier';
import { EntityType } from '../EntityModel/types';
import { EntityHistory } from './types';

export const onSetEntityHistory = (entityType: EntityType, entityId: Id, history: EntityHistory) =>
  action(C.onSetEntityHistory, { entityType, entityId, history })
