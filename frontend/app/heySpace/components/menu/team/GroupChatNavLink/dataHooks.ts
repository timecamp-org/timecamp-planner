import { useCallback } from 'react';

import { useDispatch } from 'react-redux';

import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import * as ProjectsActions from 'models/domain/ProjectsModel/actions';
import { selectProjectIdByConversationId } from 'models/domain/ProjectsModel/selectors';

interface DataProviderHookInterface {
  projectId: Id;
}

export const useDataProvider = (conversationId: Id): DataProviderHookInterface => {
  const projectId = useSelector((state) => selectProjectIdByConversationId(state, { conversationId }));

  return {
    projectId,
  };
};

interface DataPersisterHookInterface {
  onHideConversation: VoidFunction;
}

export const useDataPersister = (conversationId: Id): DataPersisterHookInterface => {
  const dispatch = useDispatch();

  const onHideConversation = useCallback(
    () => dispatch(ProjectsActions.onSetIsConversationVisible(conversationId, false)),
    [dispatch, conversationId]
  );

  return {
    onHideConversation,
  };
};
