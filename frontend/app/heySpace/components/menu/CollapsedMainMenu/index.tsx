import { FC, memo } from 'react';

import { Divider } from '@mui/material';

import { useSelector } from 'common/hooks/useSelector';
import OpenQuickSwitcherButton from 'commonComponents/OpenQuickSwitcherButton';
import { selectIsEmbedded } from 'models/domain/AppModel/selectors';
import { selectIsCurrentUserOrganizationGuestInvitedByLink } from 'models/domain/ChatWithMeModel/selectors';

import { PlannerLogo } from '../../common/PlannerLogo/PlannerLogo';
import CurrentUserNavInfo from '../currentUserSettings/CurrentUserNavInfo';
import { LeftMenuUnreadsProvider } from '../LeftMenuUnreadsController/context';
import MyTasksButton from '../MyTasksButton';
import { NotificationsButton } from '../NotificationsButton/NotificationsButton';
import OverwatchButton from '../OverwatchButton';
import { ScheduleButton } from '../ScheduleButton';
import SidebarToggle from '../SidebarToggle';
import { WorkSpaceSettingsButton } from '../WorkspaceSettingsButton/WorkspaceSettingsButton';

import { ChatsButton } from './components/ChatsButton';
import { ProjectButton } from './components/ProjectsButton';
import { TemporaryDrawerContext } from './components/TemporaryDrawerContext';
import styles from './styles.css';

const CollapsedMainMenu = () => {
  const isEmbedded = useSelector(selectIsEmbedded);
  const isCurrentUserOrganizationGuestInvitedByLink = useSelector(selectIsCurrentUserOrganizationGuestInvitedByLink);

  if (isEmbedded) {
    return null;
  }

  return (
    <div id={'CollapsedMainMenu'} className={styles.Component}>
      <LeftMenuUnreadsProvider>
        <MainMenuCollapsed isCurrentUserOrganizationGuestInvitedByLink={isCurrentUserOrganizationGuestInvitedByLink} />
      </LeftMenuUnreadsProvider>
    </div>
  );
};

type MainMenuCollapsedInterface = {
  isCurrentUserOrganizationGuestInvitedByLink: boolean;
};

const MainMenuCollapsed: FC<MainMenuCollapsedInterface> = memo((props) => (
  <TemporaryDrawerContext>
    <div className={styles.collapsedMenu}>
      <SidebarToggle className={styles.sidebarToggle} />
      <PlannerLogo isCollapsed className={styles.logo} />
      <div className={styles.itemSpacing}>
        <div className={styles.flex}>
          {!props.isCurrentUserOrganizationGuestInvitedByLink && <OpenQuickSwitcherButton isCollapsed />}
        </div>
        <MyTasksButton isCollapsed />
        <ScheduleButton isCollapsed />
        {!props.isCurrentUserOrganizationGuestInvitedByLink && <OverwatchButton isCollapsed />}
      </div>
      <Divider />
      <ProjectButton />
      <ChatsButton />

      <div className={styles.footer}>
        <Divider />
        <NotificationsButton isCollapsed />
        <WorkSpaceSettingsButton isCollapsed />
        <div className={styles.userButton}>
          <CurrentUserNavInfo direction={'vertical'} isCollapsed />
        </div>
      </div>
    </div>
  </TemporaryDrawerContext>
));

export default memo(CollapsedMainMenu);
