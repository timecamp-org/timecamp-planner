import React from 'react';

import { useDispatch } from 'react-redux';

import { useSelector } from 'common/hooks/useSelector';
import UniversalModal from 'commonComponents/UniversalModal';
import { useTranslation } from 'i18n';
import { selectProjectColor } from 'models/domain/ProjectsModel/selectors';
import { onFetchExportedBoardCardsData } from 'models/domain/RequestModel/actions';

interface ExportToCSVModalInterface {
  projectId: string;
  onCloseModal: VoidFunction;
}

export const ExportToCSVModal: React.FC<ExportToCSVModalInterface> = ({ projectId, onCloseModal }) => {
  const { t } = useTranslation();
  const projectColor = useSelector((state) => selectProjectColor(state, { projectId }));

  const dispatch = useDispatch();

  const onDownloadSpaceAsCSV = () => dispatch(onFetchExportedBoardCardsData(projectId));

  return (
    <UniversalModal
      isModalOpen={true}
      shouldRenderCloseIcon={false}
      color={projectColor}
      header={t(`EXPORT PROJECT`)}
      saveButtonCaption={t('Download')}
      cancelButtonCaption={t('Cancel')}
      onSetIsModalOpen={onCloseModal}
      onModalSave={onDownloadSpaceAsCSV}
    >
      <span>{t('Do you want to download project as an CSV file?')}</span>
    </UniversalModal>
  );
};
