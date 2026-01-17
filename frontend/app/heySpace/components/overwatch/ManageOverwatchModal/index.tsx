import React from 'react';

import { AnyDict } from 'common/types';
import UniversalModal from 'commonComponents/UniversalModal';
import { useTranslation } from 'i18n';
import { TranslateFunction } from 'i18n/types';

import { Box, SxProps } from '@mui/material';
import InputIcon from 'commonComponents/InputIcon';
import SpaceOption from './SpaceOption';
import Toolbar from './Toolbar';
import useComponent from './hook';
import styles from './styles.css';

const contentWrapperStyles: SxProps = {};

export type ManageOverwatchModalInterface = AnyDict;
const ManageOverwatchModal: React.FC<ManageOverwatchModalInterface> = (props) => {
  const { t } = useTranslation();
  const hook = useComponent(props);

  return (
    <UniversalModal
      shouldRenderCloseIcon={true}
      innerModalDialogClassName={styles.innerModalDialogClassName}
      isModalOpen={hook.isModalOpen}
      modalBodyClassName={styles.modalbodyClassName}
      cancelButtonCaption={t('Cancel')}
      saveButtonCaption={t('Save')}
      header={t('ADD PROJECTS TO OVERWATCH')}
      onSetIsModalOpen={hook.onCloseModal}
      onModalSave={hook.onModalSave}
      onModalCancel={hook.onCancel}
    >
      <Box sx={contentWrapperStyles}>
        <InputIcon
          placeholder={t('Name your project here')}
          value={hook.searchPhrase}
          onChange={hook.onChangeSearchPhrase}
        />
        <Toolbar onSelectAllProjects={hook.onSelectAllProjects} onDeselectAllProjects={hook.onDeselectAllProjects} />
        <div className={styles.options}>
          {hook.filteredSpaceIds.map((spaceId) => {
            const onClick = () => hook.onSpaceItemClick(spaceId);
            return (
              <SpaceOption
                spaceId={spaceId}
                isSelected={hook.selectedSpaceIds.includes(spaceId)}
                onClick={onClick}
                key={spaceId}
              />
            );
          })}
          {hook.filteredSpaceIds.size === 0 && renderCaseEmpty(t)}
        </div>
      </Box>
    </UniversalModal>
  );
};

function renderCaseEmpty(t: TranslateFunction) {
  return <div className={styles.empty}>{t('Hmm... nothing matches your search.')}</div>;
}
export default ManageOverwatchModal;
