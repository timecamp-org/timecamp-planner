import { FC, memo, useContext } from 'react';

import { Divider } from '@mui/material';

import OpenQuickSwitcherButton from 'commonComponents/OpenQuickSwitcherButton';

import LeftMenuUnreadsController from '../LeftMenuUnreadsController';
import { LeftMenuUnreadsContext, LeftMenuUnreadsProvider } from '../LeftMenuUnreadsController/context';
import MyTasksButton from '../MyTasksButton';
import OverwatchButton from '../OverwatchButton';
import { ScheduleButton } from '../ScheduleButton';
import SidebarToggle from '../SidebarToggle';

import useComponent from './hook';
import { ChatsSection } from './partials/ChatsSection';
import { FooterSection } from './partials/FooterSection';
import { LogoSection } from './partials/LogoSection';
import { ProjectsSection } from './partials/ProjectsSection';
import styles from './styles.css';

const MainMenu = () => {
  const {
    isEmbedded,
    shouldRenderWorkspacesPanel,
    isCurrentUserOrganizationGuestInvitedByLink,
    hasAccessToProjectGroups,
  } = useComponent();

  if (isEmbedded) {
    return null;
  }

  return (
    <div id={'MainMenu'} className={styles.Component}>
      <LeftMenuUnreadsProvider>
        <MainMenuRight
          isCurrentUserOrganizationGuestInvitedByLink={isCurrentUserOrganizationGuestInvitedByLink}
          hasAccessToProjectGroups={hasAccessToProjectGroups}
        />
      </LeftMenuUnreadsProvider>
    </div>
  );
};

type MainMenuRightInterface = {
  isCurrentUserOrganizationGuestInvitedByLink: boolean;
  hasAccessToProjectGroups: boolean;
};

const MainMenuRight: FC<MainMenuRightInterface> = memo(
  ({
    isCurrentUserOrganizationGuestInvitedByLink,
    hasAccessToProjectGroups,
  }) => {
    const context = useContext(LeftMenuUnreadsContext);

    return (
      <div className={styles.rightPanel}>
        <SidebarToggle shouldShowBadge={false} />
        <LogoSection />
        <div className={styles.flex}>{!isCurrentUserOrganizationGuestInvitedByLink && <OpenQuickSwitcherButton />}</div>
        {<MyTasksButton />}
        <ScheduleButton />
        {!isCurrentUserOrganizationGuestInvitedByLink && <OverwatchButton />}

        <div className={styles.mainMenuWrapper}>
          <LeftMenuUnreadsController isUpgradeButtonVisible={false} />
          <Divider />
          <div
            id="mainMenu-nav"
            ref={context.onSetNavListRef}
            onScroll={context.onScrollNavList}
            className={styles.mainMenu}
          >
            <ProjectsSection hasAccessToProjectGroups={hasAccessToProjectGroups} />
            <ChatsSection />
          </div>
          <Divider />
        </div>

        <FooterSection />
      </div>
    );
  },
);

export default memo(MainMenu);
