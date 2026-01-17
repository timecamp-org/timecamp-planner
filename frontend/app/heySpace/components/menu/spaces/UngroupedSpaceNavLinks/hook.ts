import { useCallback } from 'react';

import { List } from 'immutable';
import { useParams } from 'react-router';

import useLazyList from 'common/hooks/useLazyList';
import { Id } from 'common/utils/identifier';

import { useDataProvider } from './dataHooks';

export type UngroupedSpaceNavLinksHookInterface = {
  spaceIds: List<Id>;
  isEmptySpacesVisible: boolean;
  isRequestFinished: boolean;
  isSelected: (spaceId: Id) => boolean;
};

export default function useComponent(): UngroupedSpaceNavLinksHookInterface {
  const {
    spaceIds,
    currentOrganizationId,
    isRequestFinished,
    projectGroupIds,
  } = useDataProvider();

  const isEmptySpacesVisible =
    spaceIds.isEmpty() && isRequestFinished && projectGroupIds.isEmpty();

  const { projectId: currentProjectId } = useParams<{ projectId: Id }>();

  const isSelected = useCallback(
    (spaceId: Id) => spaceId === currentProjectId,
    [currentProjectId]
  );

  const { slicedItemIds } = useLazyList<Id>(spaceIds, currentOrganizationId, 5);

  return {
    spaceIds: slicedItemIds,
    isEmptySpacesVisible,
    isRequestFinished,
    isSelected,
  };
}
