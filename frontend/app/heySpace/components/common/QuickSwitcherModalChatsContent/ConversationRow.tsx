import React from 'react';

import { Id } from 'common/utils/identifier';
import Badge from 'commonComponents/Badge';
import { BadgeNotificationType } from 'commonComponents/Badge/types';
import ProjectConversationNames from 'components/projects/ProjectConversationNames';
import ProjectIcon from 'components/projects/ProjectIcon';
import { ConversationDescriptorRecordInterface } from 'models/domain/ProjectsModel/types';

import { renderLastActivityLabel } from './component';
import styles from './styles.css';

interface ConversationRowInterface {
  descriptor: ConversationDescriptorRecordInterface;
  isHighlighted: boolean;
  onGoToProject: (projectId: Id) => void;
  onMouseMoveOverListItem: (projectId: Id) => void;
}

const ConversationRow: React.FC<ConversationRowInterface> = ({
  descriptor,
  isHighlighted,
  onGoToProject,
  onMouseMoveOverListItem,
}) => {
  const { projectId, lastConversationMessageCreatedAt } = descriptor;

  return (
    <div
      id={`SpacesListSearch-${projectId}`}
      className={`${styles.searchRow} ${isHighlighted ? styles.highlightedItem : ''}`}
      onClick={() => onGoToProject(projectId)}
      onMouseMove={() => onMouseMoveOverListItem(projectId)}
    >
      <ProjectIcon projectId={projectId} className={styles.projectIcon} personIconClassName={styles.personIcon} />
      <div className={styles.description}>
        <ProjectConversationNames className={styles.searchRowSpaceName} projectId={projectId} />
        <Badge className={styles.badge} objectId={projectId} objectType={BadgeNotificationType.CONVERSATION} />
      </div>
      <div className={styles.rightSection}>
        {lastConversationMessageCreatedAt && renderLastActivityLabel(lastConversationMessageCreatedAt)}
      </div>
    </div>
  );
};

export default React.memo(ConversationRow);
