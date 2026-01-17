import { QueryClientProvider } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

import { useUserTrackerEvent } from 'common/hooks/useUserTrackerEvent';
import { makeProjectChatLink } from 'common/utils/routerHelpers';
import NoAccessToFeatureModal from 'commonComponents/NoAccessToFeatureModal';
import { useTranslation } from 'i18n';
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants';
import { ExtensionNamespace } from 'models/domain/ExtensionsModel/types';
import { filesQueryClient } from 'models/domain/FilesModel/queryClient';
import { selectHasAccessToExtension } from 'models/domain/SubscriptionLimitsModel/selectors';

import * as projectActions from '../../../../common/models/domain/ProjectsModel/actions';

import SpaceFileList from './SpaceFileList';
import { ColumnConfig } from './types';

interface SpaceFileListViewInterface {
  config?: ColumnConfig[];
  className?: string;
  spaceId: string;
}

const SpaceFileListView = ({ spaceId }: SpaceFileListViewInterface) => {
  useUserTrackerEvent(UserTrackerEvent.featureUsed, { name: 'File list' });
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const isFileListEnabled = useSelector((state) =>
    selectHasAccessToExtension(state, {
      extensionNamespace: ExtensionNamespace.FILE_LIST,
    })
  );

  const onDropFiles = (files) => {
    dispatch(
      projectActions.onCreateProjectFiles({
        files,
        projectId: spaceId,
      })
    );
  };

  return isFileListEnabled ? (
    <QueryClientProvider client={filesQueryClient}>
      {/* 
      // @ts-ignore */}
      <SpaceFileList projectId={spaceId} onUploadFiles={onDropFiles} />
    </QueryClientProvider>
  ) : (
    <NoAccessToFeatureModal
      fallbackUrl={makeProjectChatLink({
        projectId: spaceId,
      })}
      title={t('File List is not available in your current plan.')}
      featureName={t('Files')}
    />
  );
};

export default SpaceFileListView;
