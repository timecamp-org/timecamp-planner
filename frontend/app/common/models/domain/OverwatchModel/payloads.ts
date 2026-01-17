import { List } from 'immutable';
import { Id } from 'common/utils/identifier';

export interface OnCreateOverwatchViewPayload {
  spaceIds: List<Id>
}

export interface OnUpdateOverwatchViewsPayload {
  selectedSpaceIds: List<Id>,
  overwatchViewId: Id,
}