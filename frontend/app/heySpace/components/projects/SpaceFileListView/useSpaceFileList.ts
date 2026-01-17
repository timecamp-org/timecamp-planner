import { useEffect, useState } from 'react';

import { orderBy } from 'lodash';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';

import { useAlertNotification } from 'common/hooks/useAlertNotification';
import usePrevious from 'common/hooks/usePrevious';
import { useSelector } from 'common/hooks/useSelector';
import { SortOrder } from 'common/types';
import { Id } from 'common/utils/identifier';
import { i18n } from 'i18n';
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types';
import {
  selectConversationIdByProjectId,
  selectDirectChatPartner,
  selectProjectIsGroupOrDirectChat,
} from 'models/domain/ProjectsModel/selectors';
import { ProjectPanelType } from 'models/domain/ProjectsSettingsModel/types';
import { onFetchConversationViewData, onFetchProjectViewData } from 'models/domain/RequestModel/actions';
import * as RequestTypesConstants from 'models/domain/RequestModel/constants/requestTypes';
import { getRequestTypeWithParams } from 'models/domain/RequestModel/helpers';
import { onSetProjectLastOpenedPanel } from 'utils/lastOpenedPanelController';

import { selectIsRequestFinished } from '../../../../common/models/domain/RequestModel/selectors/index';

import { FileData } from './types';
import { fetchProjectFilesRequest } from './utils';
import { getFilesQueryId } from 'models/domain/FilesModel/helpers';

interface UseSpaceFileListInterface {
  data: FileData[];
  sort: (sortBy: keyof FileData, order: SortOrder) => void;
  clearSort: VoidFunction;
  order: SortOrder | null;
  sortKey: keyof FileData;
  isLoading: boolean;
  isConversation: boolean;
}

export const useSpaceFileList = (projectId: Id): UseSpaceFileListInterface => {
  const dispatch = useDispatch();

  const isConversation = useSelector((state) =>
    selectProjectIsGroupOrDirectChat(state, {
      projectId,
    })
  );

  const conversationId = useSelector((state) => selectConversationIdByProjectId(state, { projectId }));
  const directChatPartnerId = useSelector((state) => selectDirectChatPartner(state, { conversationId }));
  const prevProjectId = usePrevious(projectId);

  const queryId = getFilesQueryId(projectId);
  const [sortedData, setSortedData] = useState([]);
  const [sortOrder, setSortOrder] = useState<SortOrder | null>(null);
  const [sortKey, setSortKey] = useState<keyof FileData | null>(null);

  const onAlert = useAlertNotification({
    id: `project-${projectId}-attachments`,
    kind: HumanMessageKind.error,
  });

  const filesQuery = useQuery(queryId, () => fetchProjectFilesRequest(projectId), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    onSuccess: (data) => {
      if (!data) {
        onAlert(i18n.t(`Couldn't fetch attachments`));

        return;
      }
      setSortedData(data);
    },
  });
  const queryParams = { fetchArchived: true };
  const requestType = getRequestTypeWithParams(
    isConversation ? RequestTypesConstants.getConversationViewData : RequestTypesConstants.getProjectViewData,
    queryParams
  );
  const hasArchivedTasksLoaded = useSelector((state) =>
    selectIsRequestFinished(state, {
      requestType,
      objectId: projectId,
    })
  );

  useEffect(() => {
    if (prevProjectId === projectId) {
      return;
    }
    if (!hasArchivedTasksLoaded) {
      if (isConversation) {
        dispatch(onFetchConversationViewData(projectId, directChatPartnerId, queryParams));
      } else {
        dispatch(onFetchProjectViewData(projectId, queryParams));
      }
    }
    onSetProjectLastOpenedPanel(projectId, ProjectPanelType.FILES);
  }, [projectId, prevProjectId]);

  const clearSort = () => {
    setSortOrder(null);
    setSortKey(null);
    setSortedData(filesQuery.data);
  };

  const sort = (sortBy: keyof FileData, order: SortOrder | null) => {
    setSortOrder(order);
    setSortKey(sortBy);
    setSortedData(orderBy(filesQuery.data, sortBy, order));
  };

  const isLoading = filesQuery.isLoading || filesQuery.isRefetching || !hasArchivedTasksLoaded;

  return {
    data: sortedData,
    clearSort,
    sort,
    order: sortOrder,
    sortKey,
    isLoading,
    isConversation,
  };
};
