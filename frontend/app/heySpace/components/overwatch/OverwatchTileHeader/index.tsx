import React from 'react';
import { Id } from 'common/utils/identifier';
import { ViewSettingsViewType } from 'models/domain/ViewSettingsModel/types';
import SpaceViewHeader from '../SpaceViewHeader';
import { useOverwatchViewType } from '../tiles/hooks';

export type OverwatchTileHeaderInterface = {
  viewId: Id;
};

const OverwatchTileHeader: React.FC<OverwatchTileHeaderInterface> = (props) => {
  const viewType = useOverwatchViewType(props.viewId);
  switch (viewType) {
    case ViewSettingsViewType.CHAT:
    case ViewSettingsViewType.BOARD:
    case ViewSettingsViewType.TIMELINE:
      return null;
    default:
      throw new Error('Not implemented view header');
  }
};

export default OverwatchTileHeader;
