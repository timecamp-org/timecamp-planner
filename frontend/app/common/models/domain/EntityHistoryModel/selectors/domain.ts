import { createSelector } from 'reselect'
import * as EntityHistoryModelConstants from '../constants'

import { Map } from 'immutable'
import { Id } from '../../../../utils/identifier';
import { EntityType } from '../../EntityModel/types';
import { EntityHistory } from '../types';

export const selectEntityHistoryModelDomain = (state) => state.get(EntityHistoryModelConstants.domain)

export const selectEntityHistoryDomain = createSelector(
  selectEntityHistoryModelDomain,
  (domain) => domain.get('entityHistory') as Map<EntityType, Map<Id, EntityHistory>>,
)
