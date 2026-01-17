import { lazy } from 'react';

import PropTypes from 'prop-types';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Route as Case, Redirect, Switch } from 'react-router-dom';

import { doNothing } from 'common/utils';
import SuspenseComponent from 'commonComponents/asyncRenderers/SuspenseComponent';
import NavLink from 'commonComponents/NavLink';
import MenuButton from 'components/buttons/MenuButton';
import TagsOverviewPage from 'components/tags/TagsOverviewPage';
import { useTranslation } from 'i18n';
import colorStyles from 'styles/colors.css';

import PreferencesPage from '../preferences/PreferencesPage';
import UserProfilePage from '../userProfile/UserProfilePage';
import ManageWorkspacesPage from '../workspaceSettings/ManageWorkspacesPage';
import WorkspaceSettingsAddonsPage from '../workspaceSettings/WorkspaceSettingsAddonsPage';
import WorkspaceSettingsPage from '../workspaceSettings/WorkspaceSettingsPage';
import WorkspaceSwitcher from '../workspaceSettings/WorkspaceSwitcher';

import { Box, Divider } from '@mui/material';
import { ArrowUpLong } from 'commonComponents/Icons/fontawesome/ArrowUpLong';
import { Code } from 'commonComponents/Icons/fontawesome/Code';
import { Folders } from 'commonComponents/Icons/fontawesome/Folders';
import { Gear } from 'commonComponents/Icons/fontawesome/Gear';
import { Puzzle } from 'commonComponents/Icons/fontawesome/Puzzle';
import { Tags } from 'commonComponents/Icons/fontawesome/Tags';
import { UserGear } from 'commonComponents/Icons/fontawesome/UserGear';
import styles from './styles.css';

const DeveloperConsolePage = lazy(() => import('components/settings/developerConsole/DeveloperConsolePage'));

const centerWrapperStyles = {
  width: '100%',
  height: '100vh',
  overflow: 'scroll',
};

SettingsPage.propTypes = {
  workspaceName: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  workspaceThumbnail: PropTypes.string,
  onGoBack: PropTypes.func,
};

SettingsPage.defaultProps = {
  settingsPath: '/settings',
  profileSettingsPath: '/settings/profile',
  developerConsolePath: '/settings/developer',
  manageWorkspacesSettingsPath: '/settings/manageWorkspaces',
  workspaceSettingsPath: '/settings/workspace',
  preferencesPath: '/settings/preferences',
  tagsSettingsPath: '/settings/tags',
  addonsSettingsPath: '/settings/addons',
  onGoBack: doNothing,
};

const queryClient = new QueryClient();

function SettingsPage(props) {
  const { t } = useTranslation();

  return (
    <QueryClientProvider client={queryClient}>
      <div className={styles.Component}>
        <div className={styles.page}>
          {renderLeftSide()}

          <Box sx={centerWrapperStyles}>
            {renderHeader()}

            <div className={styles.center}>
              {renderContent()}
            </div>
          </Box>
        </div>
      </div>
    </QueryClientProvider>
  );

  function renderLeftSide() {
    return (
      <div className={styles.left}>
        {renderBackButton()}
        {renderProfileSettingsLink()}

        {renderManageWorkspacesRow()}
        <Divider className={styles.divider} variant="fullWidth" />

        <WorkspaceSwitcher className={styles.workspaceSwitcher} />
        <div className={styles.workspaceSection}>
          {props.isWorkspaceSettingsVisible &&
            renderWorkspaceMenuButton(props.workspaceSettingsPath, Gear, t('Workspace settings'))}
          {renderWorkspaceMenuButton(props.preferencesPath, UserGear, t('Personal preferences'))}
          {props.isTagsSettingsVisible && renderWorkspaceMenuButton(props.tagsSettingsPath, Tags, t('Tags'))}
          {props.isAddonsVisible && renderWorkspaceMenuButton(props.addonsSettingsPath, Puzzle, t('Addons'))}
        </div>
        <Divider variant="fullWidth" />
        {renderDeveloperConsoleLink()}
      </div>
    );
  }

  function renderProfileSettingsLink() {
    const active = isActive(props.profileSettingsPath);
    return (
      <NavLink to={props.profileSettingsPath} className={styles.navLinkTwo}>
        <button
          className={active ? styles.settingsButtonActive : styles.settingsButton}
          isActive={isActive(props.profileSettingsPath)}
        >
          <UserGear className={styles.icon} />
          {t('Profile Settings')}
        </button>
      </NavLink>
    );
  }

  function renderDeveloperConsoleLink() {
    const active = isActive(props.developerConsolePath);
    return (
      <div className={styles.navigationRow}>
        <NavLink to={props.developerConsolePath} className={styles.navLinkTwo}>
          <button className={active ? styles.settingsButtonActive : styles.settingsButton}>
            <Code className={styles.icon} />
            <span>{t('Developer console')}</span>
          </button>
        </NavLink>
      </div>
    );
  }

  function renderWorkspaceMenuButton(path, Icon, title) {
    const active = isActive(path);
    return (
      <NavLink to={path} className={styles.navLink}>
        <MenuButton isSelected={active} className={active ? styles.menuButtonActive : styles.menuButton}>
          {() => (
            <>
              <Icon className={styles.icon} />
              {title}
            </>
          )}
        </MenuButton>
      </NavLink>
    );
  }

  function renderManageWorkspacesRow() {
    const active = isActive(props.manageWorkspacesSettingsPath);
    return (
      <>
        <div className={styles.navigationRow}>
          <NavLink to={props.manageWorkspacesSettingsPath} className={styles.navLinkTwo}>
            <button
              className={active ? styles.settingsButtonActive : styles.settingsButton}
              color={colorStyles.lightGreyColor}
              isActive={isActive(props.manageWorkspacesSettingsPath)}
            >
              <Folders className={styles.icon} />
              {t('Manage Workspaces')}
            </button>
          </NavLink>
        </div>
      </>
    );
  }

  function renderBackButton() {
    return (
      <button onClick={props.onGoBack} className={styles.backButton}>
        <ArrowUpLong className={styles.backIcon} />
        {t('Go back')}
      </button>
    );
  }

  function renderHeader() {
    return (
      <div className={styles.header}>
        <div className={styles.title}>
          {renderHeaderIcon()}
          {getHeaderText()}
        </div>
      </div>
    );
  }

  function renderContent() {
    return (
      <div className={styles.content}>
        <SuspenseComponent>
          <Switch>
            <Case exact path={props.settingsPath} component={() => <Redirect to={props.profileSettingsPath} />} />
            <Case exact path={props.profileSettingsPath} component={UserProfilePage} />
            <Case exact path={props.developerConsolePath} component={DeveloperConsolePage} />
            <Case path={props.manageWorkspacesSettingsPath} component={ManageWorkspacesPage} />
            <Case path={props.workspaceSettingsPath} component={WorkspaceSettingsPage} />
            <Case path={props.preferencesPath} component={PreferencesPage} />
            <Case path={props.addonsSettingsPath} component={WorkspaceSettingsAddonsPage} />
            <Case path={props.tagsSettingsPath} component={TagsOverviewPage} />
          </Switch>
        </SuspenseComponent>
      </div>
    );
  }

  function getHeaderText() {
    switch (props.location.pathname) {
      case props.profileSettingsPath:
        return t('Your profile');
      case props.manageWorkspacesSettingsPath:
        return t('Manage Workspaces');
      case props.workspaceSettingsPath:
        return t(`Workspace settings`);
      case props.addonsSettingsPath:
        return t(`Addons settings`);
      case props.preferencesPath:
        return t(`Preferences`);
      case props.tagsSettingsPath:
        return t(`Tags overview`);
      case props.developerConsolePath:
        return t(`Developer console`);
      default:
        return t('Your account settings');
    }
  }

  function renderHeaderIcon() {
    switch (props.location.pathname) {
      case props.tagsSettingsPath:
        return <Tags className={styles.icon} />;
      default:
        return <Gear className={styles.icon} />;
    }
  }

  function isActive(path) {
    return props.location.pathname === path;
  }
}

export default SettingsPage;
