import { Add } from 'commonComponents/Icons/fontawesome/Add';
import { Plus } from 'commonComponents/Icons/fontawesome/Plus';
import SecondaryButton from 'components/buttons/SecondaryButton';
import MeetController from 'components/meet/MeetController';
import { AddTask } from 'components/tasks/AddTask';
import { RightPanelType } from 'models/domain/ProjectsSettingsModel/types';
import { TaskCreateSource } from 'models/domain/TasksModel/types';
import getSpaceUrl from 'utils/getSpaceUrl';

import FilterNavlink from '../../components/FilterNavlink/FilterNavlink';
import RightPanelLinks from '../../components/RightPanelLinks';
import SearchOrIcon from '../../components/SearchOrIcon';
import { viewTypesWithoutSection } from '../../const';
import styles from '../../styles.css';

import { SpaceViewHeaderInterface } from './SpaceViewHeader';
import { useSpaceRightPanelLinks } from './useSpaceRightPanelLinks';

type SpaceViewRightPanelLinksProps = Pick<
  SpaceViewHeaderInterface,
  | 'projectId'
  | 'projectPanelType'
  | 'isRightActionsVisible'
  | 'projectColor'
  | 'onOpenAddCardModal'
  | 'isTaskSearchFocused'
  | 'onSetIsTaskSearchFocused'
  | 'isRightPanelActive'
>;

const ICON_COLOR = 'var(--color-black)';

const SpaceViewRightPanelLinks = (props: SpaceViewRightPanelLinksProps) => {
  const rightPanelLinks = useSpaceRightPanelLinks(props);

  const isProjectPanelTypeExcluded = viewTypesWithoutSection.includes(props.projectPanelType);

  return (
    <div className={styles.panelFlexWrapper}>
      <MeetController
        objectId={props.projectId}
        buttonClassName={styles.meetController}
        color={props.projectColor || ICON_COLOR}
      />

      {props.isRightActionsVisible && <SearchOrIcon {...props} />}

      {props.isRightActionsVisible && (
        <FilterNavlink {...props} to={getSpaceUrl(props.projectId, props.projectPanelType, RightPanelType.FILTERS)} />
      )}

      <AddTask projectId={props.projectId} taskCreateSource={TaskCreateSource.SPACE_TIMELINE}>
        <Plus />
      </AddTask>

      <RightPanelLinks rightPanelLinks={rightPanelLinks} />
    </div>
  );
};

export default SpaceViewRightPanelLinks;
