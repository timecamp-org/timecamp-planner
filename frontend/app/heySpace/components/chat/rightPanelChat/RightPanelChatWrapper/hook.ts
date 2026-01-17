import { useState, useCallback, useEffect } from 'react';

import usePrevious from 'common/hooks/usePrevious';
import { Id } from 'common/utils/identifier';

import { useDataProvider } from './dataHooks';

import { RightPanelChatWrapperInterface } from '.';

export type RightPanelChatWrapperHookInterface = {
  projectId: Id;
  prevProjectId: Id;
  isRightPanelComponentLoaded: boolean;
  isProjectViewDataRequestLoading: boolean;
  onSetRightPanelChatAsLoaded: VoidFunction;
};

export default function useComponent(
  props: RightPanelChatWrapperInterface
): RightPanelChatWrapperHookInterface {
  const [isRightPanelComponentLoaded, onSetIsRightPanelComponentLoaded] =
    useState(false);
  const { projectId, isProjectViewDataRequestLoading } = useDataProvider(
    props.objectId
  );

  const onSetRightPanelChatAsLoaded = useCallback(
    () => onSetIsRightPanelComponentLoaded(true),
    []
  );
  const prevProjectId = usePrevious<Id>(props.objectId);

  return {
    projectId,
    prevProjectId,
    isRightPanelComponentLoaded,
    isProjectViewDataRequestLoading,
    onSetRightPanelChatAsLoaded,
  };
}
