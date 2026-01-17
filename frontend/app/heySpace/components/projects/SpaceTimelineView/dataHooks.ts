import { useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import { ExtensionNamespace } from 'models/domain/ExtensionsModel/types';
import { generateDefaultTimelineViewSettings } from 'models/domain/OverwatchModel/utils';
import { ProjectPanelType } from 'models/domain/ProjectsSettingsModel/types';
import { getViewSettings } from 'models/domain/RequestModel/constants/requestTypes';
import {
  selectIsRequestFinished,
  selectIsRequestRepeatable,
} from 'models/domain/RequestModel/selectors';
import { selectHasAccessToExtension } from 'models/domain/SubscriptionLimitsModel/selectors';
import {
  onCreateBaseViewSettings,
  onFetchViewSettings,
} from 'models/domain/ViewSettingsModel/actions';
import { selectViewSettingsIdByTypeAndContainerId } from 'models/domain/ViewSettingsModel/selectors/domain';
import {
  ViewContainerType,
  ViewSettingsViewType,
} from 'models/domain/ViewSettingsModel/types';

import { onSetProjectLastOpenedPanel } from '../../../utils/lastOpenedPanelController';

export type DataProviderHook = {
  viewId: Id;
  isTimelineViewRequestFinished: boolean;
  isTimelineViewRequestRepeatable: boolean;
  isTimelineEnabled: boolean;
};

export function useDataProvider(spaceId: Id): DataProviderHook {
  const viewId = useSelector((state) =>
    selectViewSettingsIdByTypeAndContainerId(state, {
      viewType: ViewSettingsViewType.TIMELINE,
      containerId: spaceId,
      containerType: ViewContainerType.PROJECT,
    })
  );
  const isTimelineViewRequestFinished = useSelector((state) =>
    selectIsRequestFinished(state, {
      requestType: getViewSettings,
      objectId: [ViewSettingsViewType.TIMELINE, spaceId],
    })
  );
  const isTimelineViewRequestRepeatable = useSelector((state) =>
    selectIsRequestRepeatable(state, {
      requestType: getViewSettings,
      objectId: [ViewSettingsViewType.TIMELINE, spaceId],
    })
  );
  const isTimelineEnabled = useSelector((state) =>
    selectHasAccessToExtension(state, {
      extensionNamespace: ExtensionNamespace.TIMELINE,
    })
  );

  return {
    viewId,
    isTimelineViewRequestFinished,
    isTimelineViewRequestRepeatable,
    isTimelineEnabled,
  };
}

export type DataPersisterHook = {
  onFetchTimelineViewSettings: VoidFunction;
  onCreateViewSettings: VoidFunction;
  onUpdateLastPanelType: VoidFunction;
};

export function useDataPersister(spaceId: Id): DataPersisterHook {
  const dispatch = useDispatch();
  const { projectPanelType } =
    useParams<{ projectPanelType: ProjectPanelType }>();

  return {
    onFetchTimelineViewSettings: useCallback(() => {
      dispatch(
        onFetchViewSettings(
          ViewSettingsViewType.TIMELINE,
          ViewContainerType.PROJECT,
          spaceId
        )
      );
    }, [dispatch, spaceId]),

    onCreateViewSettings: useCallback(() => {
      dispatch(
        onCreateBaseViewSettings(
          ViewSettingsViewType.TIMELINE,
          ViewContainerType.PROJECT,
          spaceId,
          generateDefaultTimelineViewSettings()
        )
      );
    }, [dispatch, spaceId]),

    onUpdateLastPanelType: useCallback(() => {
      onSetProjectLastOpenedPanel(spaceId, projectPanelType);
    }, [spaceId, projectPanelType]),
  };
}
