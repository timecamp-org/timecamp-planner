import { useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import { EntityStatus } from 'models/domain/EntityModel/types';
import * as ProjectsModelActions from 'models/domain/ProjectsModel/actions';
import { ProjectPeopleRole } from 'models/domain/ProjectsModel/types';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';

import getSpaceUrl from '../../../utils/getSpaceUrl';

import { BrowseSpacesSpaceRowInterface, SpaceRowType } from './index';

export type BrowseSpacesSpaceRowHookInterface = {
  onClick: VoidFunction;
};

export const useComponent = (props: BrowseSpacesSpaceRowInterface): BrowseSpacesSpaceRowHookInterface => {
  const history = useHistory();
  const currentUserId = useSelector((state) => selectCurrentUserId(state));
  const dispatch = useDispatch();

  const onMemberAdd = useCallback(
    (spaceId: Id, userId: Id) => {
      dispatch(ProjectsModelActions.onMemberAdd(spaceId, userId, ProjectPeopleRole.MEMBER));
    },
    [dispatch]
  );

  const onDispatchUnarchiveSpaceAction = useCallback(
    (spaceId: Id) => {
      dispatch(ProjectsModelActions.onStatusUpdate(spaceId, EntityStatus.EXISTS, true));
    },
    [dispatch]
  );

  const onGoToSpace = useCallback(
    (spaceId: Id) => {
      history.push(getSpaceUrl(spaceId));
      props.onClick();
    },
    [history, props.onClick]
  );

  const onJoinSpace = useCallback(
    (spaceId: Id) => {
      onMemberAdd(spaceId, currentUserId);
      history.push(getSpaceUrl(spaceId));
      props.onClick();
    },
    [onMemberAdd, currentUserId, history, props.onClick]
  );

  const onUnarchiveSpace = useCallback(
    (spaceId: Id) => {
      onDispatchUnarchiveSpaceAction(spaceId);
    },
    [onDispatchUnarchiveSpaceAction]
  );

  const onClick = useCallback(() => {
    switch (props.type) {
      case SpaceRowType.ARCHIVED: {
        onUnarchiveSpace(props.spaceId);
        break;
      }
      case SpaceRowType.JOINABLE: {
        onJoinSpace(props.spaceId);
        break;
      }
      case SpaceRowType.JOINED: {
        onGoToSpace(props.spaceId);
        break;
      }
      default: {
        throw new Error(`Unsupported project row type: ${props.type}`);
      }
    }
  }, [props.type, props.spaceId, onGoToSpace, onJoinSpace, onUnarchiveSpace]);

  return {
    onClick,
  };
};
