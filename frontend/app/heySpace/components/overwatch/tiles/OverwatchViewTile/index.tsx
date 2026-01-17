import { Id } from 'common/utils/identifier';
import SpaceViewHeader from 'components/overwatch/SpaceViewHeader';
import { ViewSettingsViewType } from 'models/domain/ViewSettingsModel/types';
import React, { createContext } from 'react';
import SpaceBoardTile from '../SpaceBoardTile';
import SpaceChatTile from '../SpaceChatTile';
import SpaceListTile from '../SpaceListTile/SpaceListTile';
import SpaceTimelineTile from '../SpaceTimelineTile';
import useComponent from './hook';
import styles from './styles.css';

export type OverwatchViewTileInterface = {
  viewId: Id;
};

interface OverwatchFilterContextInterface {
  filterId: Id;
}

export const OverwatchFilterContext = createContext<OverwatchFilterContextInterface>({
  filterId: null,
});

const OverwatchViewTile: React.FC<OverwatchViewTileInterface> = (props) => {
  const hook = useComponent(props);

  const { filterId } = hook;

  return (
    <OverwatchFilterContext.Provider value={{ filterId }}>
      <div className={styles.component}>
        <SpaceViewHeader viewId={props.viewId} spaceId={hook.objectId} viewType={hook.viewType} />
        {hook.viewType === ViewSettingsViewType.TIMELINE && (
          <SpaceTimelineTile spaceId={hook.objectId} viewId={props.viewId} />
        )}
        {hook.viewType === ViewSettingsViewType.BOARD && (
          <SpaceBoardTile spaceId={hook.objectId} viewId={props.viewId} />
        )}
        {hook.viewType === ViewSettingsViewType.CHAT && <SpaceChatTile spaceId={hook.objectId} viewId={props.viewId} />}
        {hook.viewType === ViewSettingsViewType.MY_TASKS && <SpaceListTile spaceId={hook.objectId} />}
      </div>
    </OverwatchFilterContext.Provider>
  );
};

export default OverwatchViewTile;
