import { makeConversationLink } from 'common/utils/routerHelpers';
import { TextBadge } from 'commonComponents/Badge/textBadge';
import { useTranslation } from 'i18n';
import { ProjectPanelType, RightPanelType } from 'models/domain/ProjectsSettingsModel/types';

import styles from '../../styles.css';
import { LeftPanelIconType } from '../../types';

export const useDirectConversationLeftPanelLinks = (props): LeftPanelIconType[] => {
  const { t } = useTranslation();

  const baseItem = {
    conversationId: props.conversationId,
    projectColor: props.projectColor,
    currentProjectPanelType: props.projectPanelType,
  };
  const directConversationLeftPanelLinks: LeftPanelIconType[] = [
    {
      ...baseItem,
      projectPanelType: ProjectPanelType.CHAT,
      tabName: t('Chat'),
      to: makeConversationLink(props.conversationId, ProjectPanelType.CHAT, RightPanelType.TASKS),
    },
    {
      ...baseItem,
      projectPanelType: ProjectPanelType.LIST,
      tabName: t('List'),
      isDisabled: !props.isTaskListEnabled,
      disabledMessage: t(`To use our awesome List upgrade to Premium!`),
    },
    {
      ...baseItem,
      projectPanelType: ProjectPanelType.TIMELINE,
      tabName: t('Timeline'),
      isDisabled: !props.isTimelineEnabled,
    },
    {
      ...baseItem,
      projectPanelType: ProjectPanelType.CALENDAR,
      tabName: t('Calendar'),
      isDisabled: !props.isInternalCalendarEnabled,
    },
    {
      ...baseItem,
      projectPanelType: ProjectPanelType.FILES,
      tabName: t('Files'),
      isDisabled: !props.isFileListEnabled,
      disabledMessage: t(`To use our awesome List upgrade to Premium!`),
    },
  ];

  return directConversationLeftPanelLinks;
};
