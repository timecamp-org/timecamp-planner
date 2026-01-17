import styled from 'styles/styled';
import { List } from 'immutable';
import { useSelector } from 'react-redux';

import ProjectColors from 'common/commonStyles/projectColors';
import AssigneesController from 'commonComponents/AssigneesController';
import StopClickEventPropagation from 'commonComponents/StopClickEventPropagation';
import TaskProgressWithPopover from 'components/tasks/taskProgress/TaskProgressWithPopover';
import { selectTaskColor } from 'models/domain/TasksModel/selectors';

import { EntityType } from '../../../../../common/models/domain/EntityModel/types';

import styles from './styles.css';

CardEventMonth.defaultProps = {
  taskAssignees: List(),
};

const HoverIndicator = styled.div<{ color: string; isHovering: boolean }>`
  opacity: 1;

  left: 0;
  top: 0;
  height: 100%;
  width: 10px;
  background: ${({ color, isHovering }) => (isHovering ? color : 'transparent')};
`;

const CardEventWrapper = styled.div<{ color: string; isHovering: boolean }>`
  background: ${({ color, isHovering }) => `${color}${isHovering ? 80 : 30}`};

  position: relative;
  z-index: 10000;
`;

const TaskProgressWrapper = styled.div`
  margin-left: 0.5rem;
`;

export default function CardEventMonth(props) {
  const { id, title } = props.event;
  const projectColor = useSelector((state) => selectTaskColor(state, { taskId: id }));
  const contrastColor = ProjectColors.getContrastColors(projectColor)?.[800] || '';

  return (
    <CardEventWrapper
      color={props.color}
      isHovering={props.isHovering}
      key={id}
      className={`
        ${styles.Component}
        ${props.isHovering ? styles.hovered : ''}
      `}
    >
      <HoverIndicator color={props.color} isHovering={props.isHovering} />
      <div className={styles.title}>
        <span style={{ color: contrastColor }}>{title}</span>
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
      <TaskProgressWrapper>
        <TaskProgressWithPopover
          targetClassName={styles.taskProgress}
          buttonClassName={styles.taskProgressButton}
          checkmarkClassName={styles.taskProgressCheckmark}
          hideOnEmpty
          taskId={id}
          color={contrastColor || props.color}
        />
      </TaskProgressWrapper>
    </CardEventWrapper>
  );
}
