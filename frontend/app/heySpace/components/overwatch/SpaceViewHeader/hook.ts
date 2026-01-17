import { Id } from 'common/utils/identifier';
import { SpaceViewHeaderInterface } from './SpaceViewHeader';
import { useDataProvider } from './dataHooks';
import { ViewSettingsViewType } from 'models/domain/ViewSettingsModel/types';
import { useOnDeleteView, useOverwatchViewType } from '../tiles/hooks';

export type SpaceViewHeaderHookInterface = {
  spaceId: Id;
  shouldRenderDescription: boolean;
  viewType: ViewSettingsViewType;
  spaceColor: string;

  onCloseIconClick: VoidFunction;
};

const useComponent = (props: SpaceViewHeaderInterface): SpaceViewHeaderHookInterface => {
  const { spaceId, description, spaceColor } = useDataProvider(props);
  const onCloseIconClick = useOnDeleteView(props.viewId);
  const viewType = useOverwatchViewType(props.viewId);
  return {
    spaceId,
    viewType,
    shouldRenderDescription: Boolean(description && description.length > 0),
    spaceColor,

    onCloseIconClick,
  };
};

export default useComponent;
