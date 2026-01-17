import { useCallback } from 'react';

import { List } from 'immutable';
import { useDispatch } from 'react-redux';

import { useSelector } from 'common/hooks/useSelector';
import { ExtensionNamespace } from 'models/domain/ExtensionsModel/types';
import * as PersonalProjectStructureActions from 'models/domain/PersonalProjectStructureModel/actions';
import { selectProjectGroupNames } from 'models/domain/PersonalProjectStructureModel/selectors';
import { selectHasAccessToExtension } from 'models/domain/SubscriptionLimitsModel/selectors';

export type CreateGroupButtonHookInterface = {
  hasAccessToProjectGroups: boolean;
  onCreateProjectGroup: VoidFunction;
};

export default function useComponent(): CreateGroupButtonHookInterface {
  const dispatch = useDispatch();

  const groupNames = useSelector(selectProjectGroupNames);
  const hasAccessToProjectGroups = useSelector((state) =>
    selectHasAccessToExtension(state, { extensionNamespace: ExtensionNamespace.SPACE_GROUPS })
  );

  const onCreateProjectGroup = useCallback(() => {
    const newGroupName = onCreateDefaultGroupName(groupNames);
    dispatch(PersonalProjectStructureActions.onCreateProjectGroup(newGroupName));
  }, [dispatch, groupNames]);

  return {
    hasAccessToProjectGroups,
    onCreateProjectGroup,
  };
}

function onCreateDefaultGroupName(groupNames: List<string>): string {
  let groupName = `Project group #1`;
  groupNames.forEach((name) => {
    const newNameParts = name.split(' ');
    const currentNameParts = name.split(' ');

    if (newNameParts.length === 2 && newNameParts[0] === 'Project') {
      try {
        const newGroupNumber = parseInt(newNameParts[1]);
        const currentGroupNumber = parseInt(currentNameParts[1]);
        if (newGroupNumber === currentGroupNumber) {
          groupName = `Project group #${newGroupNumber + 1}`;
        }
      } catch (error) {
        // ok
      }
    }
  });

  return groupName;
}
