import React, { FC } from 'react';

import { Id } from 'common/utils/identifier';
import ColoredProjectIcon from 'commonComponents/ColoredProjectIcon';
import { XIcon } from 'commonComponents/Icons';
import { Board, Chat, Timeline } from 'commonComponents/Icons/index-NEW';
import { ViewSettingsViewType } from 'models/domain/ViewSettingsModel/types';

import SpaceViewHeaderButton from '../SpaceViewHeaderButton';

import styled from 'styles/styled';
import { Box, IconButton, SxProps } from '@mui/material';
import { useSelector } from 'common/hooks/useSelector';
import * as Icons from 'commonComponents/Icons';
import NavTabs from 'components/common/NavTabs';
import { selectProjectName } from 'models/domain/ProjectsModel/selectors';
import { Link } from 'react-router-dom';
import { BoardFilters, ListFilters, TimelineFilters } from './filters';
import useComponent from './hook';
import styles from './styles.css';

export type SpaceViewHeaderInterface = {
  viewId: Id;
  spaceId: Id;
  viewType: ViewSettingsViewType;
};

export type SpaceViewTypeTabItem = {
  label: string;
  type: ViewSettingsViewType;
  icon: React.ReactElement;
};

const navigationWrapperStyles: SxProps = {
  display: 'flex',
  marginLeft: 'auto',
  alignItems: 'center',
};

const iconButtonStyles: SxProps = {
  color: 'var(--color-gray-900)',
  '& *': {
    fill: 'var(--color-gray-900)',
  },
  '&:hover': {
    color: 'var(--color-primary-500) ',
  },
  '&:hover * ': {
    fill: 'var(--color-primary-500)  ',
  },
};

const tabItems: SpaceViewTypeTabItem[] = [
  {
    label: 'Board',
    type: ViewSettingsViewType.BOARD,
    icon: <Board />,
  },
  {
    label: 'Timeline',
    type: ViewSettingsViewType.TIMELINE,
    icon: <Timeline />,
  },
  {
    label: 'List',
    type: ViewSettingsViewType.MY_TASKS,
    icon: <Timeline />,
  },
  {
    label: 'Chat',
    type: ViewSettingsViewType.CHAT,
    icon: <Chat />,
  },
];

const projectViews = {
  board: 'kanban',
  chat: 'chat',
  timeline: 'timeline',
};

const ProjectName = styled.h2`
  display: inline-block;
  margin: unset;
  padding: unset;
  color: var(--color-gray-900);
  font-weight: var(--fontWeight-semibold);
  text-transform: uppercase;
  font-size: var(--fontSize-base);
  margin-left: 1rem;
`;

const HeightPlaceholder = styled.div`
  height: 37.5px;
`;

const SpaceViewHeader: FC<SpaceViewHeaderInterface> = (props) => {
  const hook = useComponent(props);
  const { viewType, spaceId, viewId } = props;
  const planetIconHeight = parseInt(styles.headerItemsHeight);
  const projectName = useSelector((state) => selectProjectName(state, { projectId: spaceId }));

  return (
    <div className={styles.component}>
      <div className={styles.headerLeft}>
        <ColoredProjectIcon projectId={hook.spaceId} width={planetIconHeight} height={planetIconHeight} />
        <div className={styles.nameWithDescription}>
          <ProjectName> {projectName}</ProjectName>
        </div>
      </div>
      <div className={styles.headerRight}>
        <NavTabs
          selectedTab={hook.viewType}
          tabs={tabItems.map((tab) => ({
            Component: (
              <SpaceViewHeaderButton
                key={tab.type}
                viewId={props.viewId}
                isSelected={hook.viewType === tab.type}
                tabItem={tab}
                color={hook.spaceColor}
              />
            ),
            name: tab.type,
          }))}
        />

        <Box sx={navigationWrapperStyles}>
          <HeightPlaceholder />
          {viewType === ViewSettingsViewType.BOARD && <BoardFilters spaceId={spaceId} />}
          {viewType === ViewSettingsViewType.TIMELINE && <TimelineFilters spaceId={spaceId} viewId={viewId} />}
          {viewType === ViewSettingsViewType.MY_TASKS && <ListFilters spaceId={spaceId} />}
          <Link to={`/projects/${hook.spaceId}/${projectViews[hook.viewType]}`}>
            <IconButton sx={iconButtonStyles}>
              <Icons.ArrowUpRightFromSquare />
            </IconButton>
          </Link>

          <IconButton onClick={hook.onCloseIconClick} sx={iconButtonStyles}>
            <XIcon height={10} width={10} />
          </IconButton>
        </Box>
      </div>
    </div>
  );
};

export default SpaceViewHeader;
