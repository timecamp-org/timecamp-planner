import { List } from 'immutable';
import ImmutablePropTypes from 'immutable-prop-types';
import PropTypes from 'prop-types';

import { getColorWithLightness } from 'common/utils/colors';
import AssigneesController from 'commonComponents/AssigneesController';
import StopClickEventPropagation from 'commonComponents/StopClickEventPropagation';
import TaskProgressWithPopover from 'components/tasks/taskProgress/TaskProgressWithPopover';
import colorStyles from 'styles/colors.css';

import { EntityType } from '../../../../../common/models/domain/EntityModel/types';

import styles from './styles.css';

CardEventAgenda.propTypes = {
  event: PropTypes.object.isRequired,
  taskAssignees: ImmutablePropTypes.list,
  color: PropTypes.string,
  onClick: PropTypes.func,
};

CardEventAgenda.defaultProps = {
  taskAssignees: new List(),
};

export default function CardEventAgenda(props) {
  const { id, title } = props.event;

  return (
    <div
      key={id}
      className={styles.Component}
      style={{
        backgroundColor: props.isHovering ? getColorWithLightness(props.color, 97) : 'transparent',
      }}
      onClick={props.onClick}
    >
      <div
        className={styles.title}
        style={{
          color: props.isHovering ? props.color : colorStyles.darkBlueGreyColor,
        }}
      >
        {title}
      </div>
      <StopClickEventPropagation className={styles.cardAssignees}>
        <AssigneesController
          objectType={EntityType.TASK_DATA}
          objectId={id}
          maxAssigneesRenderCount={2}
          shouldRenderTitle={false}
          isEditable={true}
        />
      </StopClickEventPropagation>
      <TaskProgressWithPopover hideOnEmpty taskId={id} />
    </div>
  );
}
