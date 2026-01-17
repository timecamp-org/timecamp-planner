import { useMutation, useQueryClient } from 'react-query';

import { UserTracker } from 'common/services';
import { Id } from 'common/utils/identifier';
import UniversalModal from 'commonComponents/UniversalModal';
import { useTranslation } from 'i18n';
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants';
import { getFilesQueryId } from 'models/domain/FilesModel/helpers';

import { FileData } from './types';
import { deleteFileRequest } from './utils';

interface DeleteFileModalInterface {
  isOpen: boolean;
  color?: string;
  onClose: () => void;
  fileIds: Id[];
  projectId: Id;
}

export const DeleteFileModal = ({ isOpen, color, onClose, fileIds, projectId }: DeleteFileModalInterface) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const queryId = getFilesQueryId(projectId);

  const { mutateAsync } = useMutation(deleteFileRequest, {
    onSuccess: (data, fileId, context) => {
      const prevData: FileData[] = queryClient.getQueryData(queryId) ?? [];
      queryClient.setQueryData(
        queryId,
        prevData.filter(({ id }) => id !== fileId)
      );
    },
  });

  const onDeleteFile = async () => {
    const promises = fileIds.map(mutateAsync as (fileId: Id) => Promise<any>);
    await Promise.allSettled(promises);
    UserTracker.track(UserTrackerEvent.featureUsed, { name: 'file-delete' });
    onClose();
  };

  const label: string =
    fileIds.length > 1
      ? t('Are you sure you want to delete those files? This cannot be undone.')
      : t('Are you sure you want to delete this file? This cannot be undone.');

  const header = fileIds.length > 1 ? t('DELETE FILES') : t('DELETE FILE');

  return (
    <UniversalModal
      isModalOpen={isOpen}
      saveButtonCaption={t('DELETE')}
      header={header}
      onModalSave={onDeleteFile}
      onSetIsModalOpen={onClose}
      color={color}
      footerButtonsColor="error"
    >
      {label}
    </UniversalModal>
  );
};
