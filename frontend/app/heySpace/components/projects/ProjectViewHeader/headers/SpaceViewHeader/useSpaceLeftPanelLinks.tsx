import { useSelector } from 'common/hooks/useSelector';
import { useTranslation } from 'i18n';
import { selectProjectHasUnreadMessages } from 'models/domain/ProjectsModel/selectors';
import { ProjectPanelType, RightPanelType } from 'models/domain/ProjectsSettingsModel/types';
import getSpaceUrl from 'utils/getSpaceUrl';
import { getLastOpenedSubPanel } from 'utils/lastOpenedPanelController';
import { LeftPanelIconType } from '../../types';
import DottedSpan from 'commonComponents/DottedSpan';

const DEFAULT_DISABLED_MESSAGE = `To use our awesome List upgrade to Premium!`;

export const useSpaceLeftPanelLinks = (props): LeftPanelIconType[] => {
  const { t } = useTranslation();

  const lastTimelineType =
    getLastOpenedSubPanel(props.projectId)?.[ProjectPanelType.TIMELINE] ?? ProjectPanelType.TIMELINE_PROJECT;

  const projectHasUnreadMessages = useSelector((state) =>
    selectProjectHasUnreadMessages(state, { projectId: props.projectId }),
  );

  const baseItem = {
    projectId: props.projectId,
    projectColor: props.projectColor,
    currentProjectPanelType: props.projectPanelType,
  };

  const spaceLeftPanelLinks: LeftPanelIconType[] = [
    {
      ...baseItem,
      projectPanelType: ProjectPanelType.KANBAN,
      tabName: t('Board'),
    },
    {
      ...baseItem,
      projectPanelType: ProjectPanelType.LIST,
      tabName: t('List'),
      isDisabled: !props.isTaskListEnabled,
      disabledMessage: t(DEFAULT_DISABLED_MESSAGE),
    },
    {
      ...baseItem,
      projectPanelType: lastTimelineType,
      name: ProjectPanelType.TIMELINE,
      disabledMessage: t(DEFAULT_DISABLED_MESSAGE),
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
      projectPanelType: ProjectPanelType.CHAT,
      tabName: <DottedSpan $hasDot={projectHasUnreadMessages}> {t('Chat')}</DottedSpan>,
      to: getSpaceUrl(props.projectId, ProjectPanelType.CHAT, RightPanelType.TASKS),
    },

    {
      ...baseItem,
      projectPanelType: ProjectPanelType.FILES,
      tabName: t('Files'),
      isDisabled: !props.isFileListEnabled,
      disabledMessage: t(DEFAULT_DISABLED_MESSAGE),
    },
  ];

  return spaceLeftPanelLinks;
};
