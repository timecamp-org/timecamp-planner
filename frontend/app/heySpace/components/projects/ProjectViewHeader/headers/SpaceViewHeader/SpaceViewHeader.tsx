import { doNothing } from 'common/utils';

import NavLink from 'commonComponents/NavLink';
import ColoredProjectIcon from 'commonComponents/ColoredProjectIcon';

import ProjectDescription from 'components/projects/ProjectDescription';
import ProjectName from 'components/projects/projectName/ProjectName';

import { ProjectPanelType, RightPanelType } from 'models/domain/ProjectsSettingsModel/types';
import getSpaceUrl from 'utils/getSpaceUrl';

import styles from '../../styles.css';

import LeftPanelLinks from '../../components/LeftPanelLinks';
import { BaseHeaderProps } from '../../types';
import SpaceViewRightPanelLinks from './SpaceViewRightPanelLinks';
import { useSpaceLeftPanelLinks } from './useSpaceLeftPanelLinks';

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
  onOpenAddCardModal: doNothing,
  onOpenRightPanelChat: doNothing,
};

export type SpaceViewHeaderInterface = {
  isSectionInputFocused: boolean;
  projectIsPrivate: boolean;
  isInternalCalendarEnabled: boolean;
  isFileListEnabled: boolean;
  projectPeopleSize: number;
  onOpenAddCardModal: () => void;
} & BaseHeaderProps;

function SpaceViewHeader(props: SpaceViewHeaderInterface) {
  const leftPanelLinks = useSpaceLeftPanelLinks(props);

  return (
    <>
      <div className={styles.projectInfo}>
        <div>
          <div className={styles.panelFlexWrapper}>
            <NavLink
              to={getSpaceUrl(props.projectId, props.projectPanelType, RightPanelType.SETTINGS)}
              onClick={props.onOpenRightPanelChat}
              className={styles.clickable}
            >
              <ColoredProjectIcon projectId={props.projectId} width={20} height={20} />
            </NavLink>
            <NavLink
              to={getSpaceUrl(props.projectId, props.projectPanelType, RightPanelType.SETTINGS)}
              onClick={props.onOpenRightPanelChat}
              className={`${styles.descriptors} ${styles.clickable}`}
            >
              <ProjectName projectId={props.projectId} className={styles.projectName} style={{}} />
              <ProjectDescription projectId={props.projectId} className={styles.description} />
            </NavLink>
          </div>

          <LeftPanelLinks leftPanelLinks={leftPanelLinks} />
        </div>
      </div>

      <SpaceViewRightPanelLinks {...props} />
    </>
  );
}

export default SpaceViewHeader;
