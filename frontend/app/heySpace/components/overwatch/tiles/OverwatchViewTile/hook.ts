import { Id } from 'common/utils/identifier';
import { OverwatchViewTileInterface } from './index';
import { ViewSettingsViewType } from 'models/domain/ViewSettingsModel/types';
import { useOverwatchViewType } from '../hooks';
import { useSelector } from 'common/hooks/useSelector';
import { selectViewSettingsContainerId } from 'models/domain/ViewSettingsModel/selectors/domain';
import { makeFilterId } from 'models/component/FiltersModel/utils';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';
import { TaskFiltersTargetType } from 'models/component/FiltersModel/types';

export type OverwatchViewTileHookInterface = {
  objectId: Id;
  viewType: ViewSettingsViewType;
  filterId: Id;
};

const useComponent = (props: OverwatchViewTileInterface): OverwatchViewTileHookInterface => {
  const currentUserId = useSelector(selectCurrentUserId);
  const viewType = useOverwatchViewType(props.viewId);
  const objectId = useSelector((state) => selectViewSettingsContainerId(state, { viewId: props.viewId }));
  const filterId = makeFilterId(currentUserId, TaskFiltersTargetType.TASK_LIST, objectId);

  return {
    objectId,
    viewType,
    filterId,
  };
};

export default useComponent;
