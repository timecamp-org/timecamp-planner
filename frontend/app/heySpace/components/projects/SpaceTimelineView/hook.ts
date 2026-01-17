import { useEffect } from 'react';

import { useParams } from 'react-router';

import usePrevious from 'common/hooks/usePrevious';
import { useUserTrackerEvent } from 'common/hooks/useUserTrackerEvent';
import { Id } from 'common/utils/identifier';
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants';

import { ProjectPanelType } from '../../../../common/models/domain/ProjectsSettingsModel/types';

import { useDataPersister, useDataProvider } from './dataHooks';

import { SpaceTimelineViewInterface } from '.';

export type SpaceTimelineViewHookInterface = {
  viewId: Id;
  isLoading: boolean;
  isTimelineEnabled: boolean;
};

export default function useComponent(
  props: SpaceTimelineViewInterface
): SpaceTimelineViewHookInterface {
  const {
    isTimelineViewRequestFinished,
    isTimelineViewRequestRepeatable,
    viewId,
    isTimelineEnabled,
  } = useDataProvider(props.spaceId);

  const {
    onCreateViewSettings,
    onFetchTimelineViewSettings,
    onUpdateLastPanelType,
  } = useDataPersister(props.spaceId);

  const prevSpaceId = usePrevious(props.spaceId);
  const { projectPanelType } =
    useParams<{ projectPanelType: ProjectPanelType }>();

  useEffect(() => {
    onUpdateLastPanelType();
  }, [projectPanelType, onUpdateLastPanelType]);

  useEffect(() => {
    if (isTimelineViewRequestRepeatable) {
      onFetchTimelineViewSettings();
    }
    onUpdateLastPanelType();
  }, []);

  useEffect(() => {
    if (
      prevSpaceId &&
      props.spaceId !== prevSpaceId &&
      isTimelineViewRequestRepeatable
    ) {
      onFetchTimelineViewSettings();
    }
  }, [
    isTimelineViewRequestRepeatable,
    props.spaceId,
    prevSpaceId,
    onFetchTimelineViewSettings,
  ]);

  useEffect(() => {
    if (isTimelineViewRequestFinished && !viewId) {
      onCreateViewSettings();
    }
    onUpdateLastPanelType();
  }, [isTimelineViewRequestFinished, viewId]);

  useUserTrackerEvent(
    UserTrackerEvent.featureUsed,
    {
      name: 'Timeline',
      panel: projectPanelType,
    },
    [projectPanelType]
  );

  return {
    viewId,
    isLoading: !isTimelineViewRequestFinished || !viewId,
    isTimelineEnabled,
  };
}
