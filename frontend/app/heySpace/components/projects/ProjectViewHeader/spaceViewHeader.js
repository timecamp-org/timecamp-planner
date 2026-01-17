import React from 'react';

import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import { Add, AlignLeft, Members, Puzzle, Search, Settings } from 'commonComponents/Icons';
import NavLink from 'commonComponents/NavLink';
import TooltipedDisabledElement from 'commonComponents/TooltipedDisabledElement';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { getTaskFiltersTargetType } from 'components/chat/rightPanelChat/utils';
import MeetController from 'components/meet/MeetController';
import ProjectDescription from 'components/projects/ProjectDescription';
import ProjectName from 'components/projects/projectName/ProjectName';
import FiltersButtonWithCounter from 'components/tasks/taskFilters/FiltersButtonWithCounter';
import TaskSearch from 'components/tasks/taskFilters/TaskSearch';
import { useTranslation } from 'i18n';
import { TaskFiltersContainerType } from 'models/component/FiltersModel/types';
import { ProjectPanelType, RightPanelType } from 'models/domain/ProjectsSettingsModel/types';
import getSpaceUrl from 'utils/getSpaceUrl';
import { getLastOpenedSubPanel } from 'utils/lastOpenedPanelController';

import FilesFilter from '../SpaceFileListView/FilesFilter';

import HeaderNavItem from './headerNavItem';
import RightPanelLink from './rightPanelLink';
import styles from './styles.css';

const viewTypesWithoutSection = [
  ProjectPanelType.CALENDAR,
  ProjectPanelType.LIST,
  ProjectPanelType.TIMELINE,
  ProjectPanelType.TIMELINE_PROJECT,
  ProjectPanelType.TIMELINE_TEAM,
];

SpaceViewHeader.propTypes = {
  projectId: PropTypes.string.isRequired,
  projectPanelType: PropTypes.oneOf([
    ProjectPanelType.CHAT,
    ProjectPanelType.KANBAN,
    ProjectPanelType.CALENDAR,
    ProjectPanelType.TIMELINE,
    ProjectPanelType.TIMELINE_TEAM,
    ProjectPanelType.TIMELINE_PROJECT,
    ProjectPanelType.LIST,
    ProjectPanelType.FILES,
  ]),
  isTaskSearchFocused: PropTypes.bool,
  isSectionInputFocused: PropTypes.bool,
  projectIsPrivate: PropTypes.bool,
  isRightActionsVisible: PropTypes.bool,
  isInternalCalendarEnabled: PropTypes.bool,
  isTimelineEnabled: PropTypes.bool,
  isTaskListEnabled: PropTypes.bool,
  isFileListEnabled: PropTypes.bool,
  projectColor: PropTypes.string,
  projectPeopleSize: PropTypes.number,

  onSetIsTaskSearchFocused: PropTypes.func,
  onClickAddSectionButton: PropTypes.func,
  onOpenRightPanelChat: PropTypes.func,
};

SpaceViewHeader.defaultProps = {
  isTaskSearchFocused: false,
  isSectionInputFocused: false,
  projectIsPrivate: false,
  isRightActionsVisible: false,
  isInternalCalendarEnabled: false,
  isTimelineEnabled: false,
  isTaskListEnabled: false,
  isFileListEnabled: false,
  projectPeopleSize: 0,
  projectPanelType: ProjectPanelType.CHAT,

  onSetIsTaskSearchFocused: doNothing,
  onClickAddSectionButton: doNothing,
  onOpenRightPanelChat: doNothing,
};

function SpaceViewHeader(props) {
  const { t } = useTranslation();

  return (
    <>
      {/* Logo with name */}
      <div className={styles.projectInfo}>
        <NavLink
          to={getSpaceUrl(props.projectId, props.projectPanelType, RightPanelType.SETTINGS)}
          onClick={props.onOpenRightPanelChat}
          className={styles.clickable}
        >
          <ColoredProjectIcon projectId={props.projectId} width={40} height={40} />
        </NavLink>
        <div className={styles.descriptorsAndNavigation}>
          <NavLink
            to={getSpaceUrl(props.projectId, props.projectPanelType, RightPanelType.SETTINGS)}
            onClick={props.onOpenRightPanelChat}
            className={`${styles.descriptors} ${styles.clickable}`}
          >
            <ProjectName
              projectId={props.projectId}
              className={styles.projectName}
              style={{ color: props.projectColor }}
            />
            <ProjectDescription projectId={props.projectId} className={styles.description} />
          </NavLink>
          <Navigation {...props} />
        </div>
      </div>
      <MeetController objectId={props.projectId} buttonClassName={styles.meetController} color={props.projectColor} />
      {props.isRightActionsVisible && <RightActions {...props} />}
      {props.projectPanelType === ProjectPanelType.FILES && <FilesFilter />}
      {/* Card list link */}
      {props.projectPanelType === ProjectPanelType.CHAT && (
        <RightPanelLink
          onClick={props.onOpenRightPanelChat}
          isActive={props.isRightPanelActive(RightPanelType.TASKS)}
          color={props.projectColor}
          to={getSpaceUrl(props.projectId, props.projectPanelType, RightPanelType.TASKS)}
          message={t('Task List')}
        >
          <AlignLeft />
        </RightPanelLink>
      )}
      {/* Settings link */}
      <RightPanelLink
        onClick={props.onOpenRightPanelChat}
        isActive={props.isRightPanelActive(RightPanelType.SETTINGS)}
        color={props.projectColor}
        to={getSpaceUrl(props.projectId, props.projectPanelType, RightPanelType.SETTINGS)}
        message={t('Settings')}
      >
        <Settings />
      </RightPanelLink>
      {/* people link */}
      <RightPanelLink
        onClick={props.onOpenRightPanelChat}
        isActive={props.isRightPanelActive(RightPanelType.MEMBERS)}
        color={props.projectColor}
        to={getSpaceUrl(props.projectId, props.projectPanelType, RightPanelType.MEMBERS)}
        message={t('Members')}
      >
        <div className={styles.linkContent}>
          <Members className={styles.membersIcon} />
          {props.projectPeopleSize}
        </div>
      </RightPanelLink>
      <RightPanelLink
        onClick={props.onOpenRightPanelChat}
        isActive={props.isRightPanelActive(RightPanelType.ADDONS)}
        color={props.projectColor}
        to={getSpaceUrl(props.projectId, props.projectPanelType, RightPanelType.ADDONS)}
        message={t('Addons')}
      >
        <div className={styles.linkContent}>
          <Puzzle className={styles.membersIcon} />
        </div>
      </RightPanelLink>
    </>
  );
}

function Navigation(props) {
  const { t } = useTranslation();

  const lastTimelineType =
    getLastOpenedSubPanel(props.projectId)?.[ProjectPanelType.TIMELINE] ?? ProjectPanelType.TIMELINE_PROJECT;

  return (
    <div className={styles.navigation}>
      <HeaderNavItem
        projectId={props.projectId}
        projectColor={props.projectColor}
        currentProjectPanelType={props.projectPanelType}
        projectPanelType={ProjectPanelType.CHAT}
        tabName={t('Chat')}
        to={getSpaceUrl(props.projectId, ProjectPanelType.CHAT, RightPanelType.TASKS)}
      />
      <HeaderNavItem
        projectId={props.projectId}
        projectColor={props.projectColor}
        currentProjectPanelType={props.projectPanelType}
        projectPanelType={ProjectPanelType.KANBAN}
        tabName={t('Board')}
      />
      <TooltipedDisabledElement
        isDisabled={!props.isTaskListEnabled}
        message={t(`To use our awesome List upgrade to Premium!`)}
      >
        <HeaderNavItem
          projectId={props.projectId}
          projectColor={props.projectColor}
          currentProjectPanelType={props.projectPanelType}
          projectPanelType={ProjectPanelType.LIST}
          tabName={t('List')}
          isDisabled={!props.isTaskListEnabled}
        />
      </TooltipedDisabledElement>
      <TooltipedDisabledElement
        isDisabled={!props.isInternalCalendarEnabled}
        message={t(`To use our awesome Calendar upgrade to Premium!`)}
      >
        <HeaderNavItem
          projectId={props.projectId}
          projectColor={props.projectColor}
          currentProjectPanelType={props.projectPanelType}
          projectPanelType={ProjectPanelType.CALENDAR}
          tabName={t('Calendar')}
          isDisabled={!props.isInternalCalendarEnabled}
        />
      </TooltipedDisabledElement>
      <TooltipedDisabledElement
        isDisabled={!props.isTimelineEnabled}
        message={t(`To use our awesome Timeline upgrade to Premium!`)}
      >
        <div className={styles.itemWithBadge}>
          <HeaderNavItem
            projectId={props.projectId}
            projectColor={props.projectColor}
            currentProjectPanelType={props.projectPanelType}
            projectPanelType={lastTimelineType}
            tabName={t('Timeline')}
            isDisabled={!props.isTimelineEnabled}
          />
        </div>
      </TooltipedDisabledElement>
      <TooltipedDisabledElement
        isDisabled={!props.isFileListEnabled}
        message={t(`To use our awesome Files upgrade to Premium!`)}
      >
        <div className={styles.itemWithBadge}>
          <HeaderNavItem
            projectId={props.projectId}
            projectColor={props.projectColor}
            currentProjectPanelType={props.projectPanelType}
            projectPanelType={ProjectPanelType.FILES}
            tabName={t('Files')}
            isDisabled={!props.isFileListEnabled}
          />
        </div>
      </TooltipedDisabledElement>
    </div>
  );
}

function RightActions(props) {
  return (
    <>
      {props.isTaskSearchFocused ? (
        <TaskSearch
          projectId={props.projectId}
          isFocused={props.isTaskSearchFocused}
          onSetIsFocused={props.onSetIsTaskSearchFocused}
        />
      ) : (
        <div>
          <SecondaryButton
            color={props.projectColor}
            className={styles.link}
            onClick={() => props.onSetIsTaskSearchFocused(true)}
          >
            <Search />
          </SecondaryButton>
        </div>
      )}

      <NavLink
        className={styles.navLink}
        to={getSpaceUrl(props.projectId, props.projectPanelType, RightPanelType.FILTERS)}
      >
        <FiltersButtonWithCounter
          containerType={TaskFiltersContainerType.PROJECT}
          containerId={props.projectId}
          targetType={getTaskFiltersTargetType(props.projectPanelType)}
          buttonClassName={styles.link}
          isActive={props.isRightPanelActive(RightPanelType.FILTERS)}
        />
      </NavLink>

      {!viewTypesWithoutSection.includes(props.projectPanelType) && (
        <div>
          <SecondaryButton className={styles.link} color={props.projectColor} onClick={props.onClickAddSectionButton}>
            <Add />
          </SecondaryButton>
        </div>
      )}
    </>
  );
}

export default SpaceViewHeader;
