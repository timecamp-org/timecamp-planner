import React from 'react';

import { Button } from '@mui/material';

import { Id } from 'common/utils/identifier';
import Badge from 'commonComponents/Badge';
import { BadgeNotificationType } from 'commonComponents/Badge/types';
import ColoredProjectIcon from 'commonComponents/ColoredProjectIcon';
import ProjectName from 'components/projects/projectName/ProjectName';
import { useTranslation } from 'i18n';
import { QuickSwitcherChatDescriptorInterface } from 'models/domain/ProjectsModel/types';

import { renderLastActivityLabel } from './component';
import styles from './styles.css';

interface ConversationRowInterface {
  descriptor: QuickSwitcherChatDescriptorInterface;
  isHighlighted: boolean;
  onGoToProject: (projectId: Id) => void;
  onJoinSpace: (projectId: Id) => void;
  onMouseMoveOverListItem: (projectId: Id) => void;
}

const SpaceRow: React.FC<ConversationRowInterface> = ({
  descriptor,
  isHighlighted,
  onGoToProject,
  onJoinSpace,
  onMouseMoveOverListItem,
}) => {
  const { isCurrentUserSpaceMember, projectId: spaceId, lastConversationMessageCreatedAt } = descriptor;

  const onClick = isCurrentUserSpaceMember ? onGoToProject : onJoinSpace;

  const { t } = useTranslation();

  return (
    <div
      id={`SpacesListSearch-${spaceId}`}
      className={`${styles.searchRow} ${isHighlighted ? styles.highlightedItem : ''}`}
      onClick={() => onClick(spaceId)}
      onMouseMove={() => onMouseMoveOverListItem(spaceId)}
    >
      <ColoredProjectIcon width={30} height={30} projectId={spaceId} />
      <div className={styles.description}>
        <ProjectName className={styles.searchRowSpaceName} projectId={spaceId} />
        <Badge className={styles.badge} objectId={spaceId} objectType={BadgeNotificationType.PROJECT} />
      </div>
      <div className={styles.rightSection}>
        {renderSpaceItemRightLabel(isCurrentUserSpaceMember, lastConversationMessageCreatedAt, t)}
      </div>
    </div>
  );
};

function renderSpaceItemRightLabel(isCurrentUserSpaceMember: boolean, lastConversationMessageCreatedAt: number, t) {
  if (isCurrentUserSpaceMember) {
    return lastConversationMessageCreatedAt ? renderLastActivityLabel(lastConversationMessageCreatedAt) : null;
  } else {
    return <Button variant="text">{t('Join project')}</Button>;
  }
}

export default React.memo(SpaceRow);
