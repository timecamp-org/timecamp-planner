import React from 'react';

import useElementOpen from 'common/hooks/useElementOpen';
import { Id } from 'common/utils/identifier';
import { CollapsablePanel } from 'commonComponents/CollapsablePanel';
import ExportBoardToCSVButton from 'commonComponents/ExportBoardToCSVButton';
import { useTranslation } from 'i18n';

import RightPanelLabel from '../../RightPanelLabel';
import { ADDONS } from '../../utils/panelNames';
import { AddonList } from '../AddonList';
import { ExportToCSVModal } from '../ExportToCSVModal';

import { useComponent } from './hook';
import styles from './styles.css';

const iconSize = 18;

export interface AddonsRightPanelChatInterface {
  projectId: Id;
}

export const AddonsRightPanelChat: React.FC<AddonsRightPanelChatInterface> = ({ projectId }) => {
  const { t } = useTranslation();
  const { isOpen: isModalOpen, onClose: onCloseModal, onOpen: onOpenModal } = useElementOpen(false);

  const { projectColor } = useComponent({ projectId });

  return (
    <div className={styles.extensions}>
      <div className={styles.header}>
        <RightPanelLabel objectId={projectId} currentPanelName={ADDONS} />
      </div>
      <div className={styles.container}>
        <CollapsablePanel title={t('Actions')} isInitiallyExpanded className={styles.panel}>
          <ExportBoardToCSVButton
            className={styles.extension}
            iconWidth={iconSize}
            iconHeight={iconSize}
            onOpenModal={onOpenModal}
            color={projectColor}
          />
        </CollapsablePanel>

        <CollapsablePanel title={t('Planner Extras')} isInitiallyExpanded className={styles.panel}>
          <AddonList projectId={projectId} />
        </CollapsablePanel>
      </div>

      {isModalOpen && <ExportToCSVModal projectId={projectId} onCloseModal={onCloseModal} />}
    </div>
  );
};
