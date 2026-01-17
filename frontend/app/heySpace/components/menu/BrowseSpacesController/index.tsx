import { FC, useCallback } from 'react';

import { Divider, Tab, Tabs } from '@mui/material';

import { UnderlinedInputWrapper } from 'commonComponents/UnderlinedInputWrapper/UnderlinedInputWrapper';
import UserInput from 'commonComponents/UserInput';
import { useTranslation } from 'i18n';
import { ProjectInterface } from 'models/domain/ProjectsModel/types';

import { useLocalStorage } from '../../../../common/hooks/useLocalStorage';
import BrowseSpacesSpaceRow, { SpaceRowType } from '../BrowseSpacesSpaceRow';
import EmptySpacesPlaceholder from '../spaces/EmptySpacesPlaceholder';

import { useComponent } from './hook';
import styles from './styles.css';

export type BrowseSpacesControllerInterface = {
  initialProjectName: string;
  onHideModal: VoidFunction;
  onUpdateModalProjectName: (searchPhrase: string) => void;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum PROJECTS_TABS {
  ALL,
  ACTIVE,
  ARCHIVED,
  MY_PROJECTS,
}

const BrowseSpacesController: FC<BrowseSpacesControllerInterface> = (props) => {
  const hook = useComponent(props);
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useLocalStorage<PROJECTS_TABS>('BrowseSpacesControllerTab', PROJECTS_TABS.ALL);

  const onTabChange = (_, newValue: PROJECTS_TABS) => {
    setCurrentTab(newValue);
  };

  const renderJoinableSpaceRow = useCallback(
    (space: ProjectInterface) => (
      <BrowseSpacesSpaceRow
        key={`BrowseSpacesSpaceRow-${space.id}`}
        type={SpaceRowType.JOINABLE}
        spaceId={space.id}
        onClick={props.onHideModal}
      />
    ),
    [props.onHideModal],
  );

  const renderJoinedSpaceRow = useCallback(
    (space: ProjectInterface) => (
      <BrowseSpacesSpaceRow
        key={`BrowseSpacesSpaceRow-${space.id}`}
        type={SpaceRowType.JOINED}
        spaceId={space.id}
        onClick={props.onHideModal}
      />
    ),
    [props.onHideModal],
  );

  const renderArchivedSpaceRow = useCallback(
    (space: ProjectInterface) => (
      <BrowseSpacesSpaceRow
        key={`BrowseSpacesSpaceRow-${space.id}`}
        type={SpaceRowType.ARCHIVED}
        spaceId={space.id}
        onClick={props.onHideModal}
      />
    ),
    [props.onHideModal],
  );

  const shouldRenderProjects = (tab: PROJECTS_TABS) => currentTab === PROJECTS_TABS.ALL || currentTab === tab;

  return (
    <div className={styles.Component}>
      <UnderlinedInputWrapper className={styles.inputWrapper}>
        <UserInput
          className={styles.input}
          autoFocus
          placeholder={t('Look for a project to join')}
          type="text"
          name="project search"
          value={hook.searchPhrase}
          isDisabled={hook.isCurrentUserOrganizationGuestInvitedByLink}
          onChange={(event) => hook.onSetSearchValue(event.target.value)}
        />
      </UnderlinedInputWrapper>
      <Tabs value={currentTab} onChange={onTabChange}>
        <Tab label={t('All')} value={PROJECTS_TABS.ALL} />
        <Tab label={t('Active')} value={PROJECTS_TABS.ACTIVE} />
        <Tab label={t('Archived')} value={PROJECTS_TABS.ARCHIVED} />
        <Tab label={t('My projects')} value={PROJECTS_TABS.MY_PROJECTS} />
      </Tabs>
      <Divider variant="fullWidth" />
      <div className={styles.searchResults}>
        {hook.isCurrentUserOrganizationGuestInvitedByLink && <EmptySpacesPlaceholder />}

        {shouldRenderProjects(PROJECTS_TABS.ACTIVE) &&
          hook.filteredAvailableInvisibleSpaces.map(renderJoinableSpaceRow)}

        {shouldRenderProjects(PROJECTS_TABS.MY_PROJECTS) &&
          hook.filteredAvailableVisibleSpaces.map(renderJoinedSpaceRow)}

        {shouldRenderProjects(PROJECTS_TABS.ARCHIVED) && hook.filteredArchivedSpaces.map(renderArchivedSpaceRow)}
      </div>
    </div>
  );
};

export default BrowseSpacesController;
