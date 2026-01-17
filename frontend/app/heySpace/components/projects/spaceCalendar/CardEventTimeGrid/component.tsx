import styles from './styles.css';

import styled from 'styles/styled';
import AssigneesController from 'commonComponents/AssigneesController';
import StopClickEventPropagation from 'commonComponents/StopClickEventPropagation';
import TaskProgressWithPopover from 'components/tasks/taskProgress/TaskProgressWithPopover';
import TimeOutput from 'components/time/TimeOutput';
import diffInHours from 'date-fns/difference_in_hours';
import { EntityType } from '../../../../../common/models/domain/EntityModel/types';

const EventWrapper = styled.div<{ color: string }>`
  height: 100%;
  background-color: ${({ color }) => `${color}30`};
  &:hover {
    background-color: ${({ color }) => `${color}80`};
  }
`;

const CardEventTimeGrid = (props) => {
  const { id, start, end, allDay } = props.event;

  const hoursDiff = Math.abs(diffInHours(end, start));
  const shouldDisplayTimeHeader = hoursDiff >= 1 && !allDay;
  const shouldDisplayFooter = hoursDiff >= 2 && !allDay;

  return (
    <EventWrapper
      color={props.color}
      key={id}
      className={`
        ${styles.Component}
        ${allDay ? styles.allDay : ''}
      `}
    >
      {!allDay && <div className={styles.cardColor} style={{ backgroundColor: props.color }} />}
      {shouldDisplayTimeHeader && renderHeader(start, end)}
      {renderTitle(props)}
      {shouldDisplayFooter && renderFooter(id, props)}
    </EventWrapper>
  );
};

function renderHeader(start, end) {
  return (
    <span className={styles.header}>
      <TimeOutput className={styles.timeOutput} timestamp={start} />
      {' - '}
      <TimeOutput className={styles.timeOutput} timestamp={end} />
    </span>
  );
}

function renderTitle(props) {
  const { title } = props.event;
  return <div className={styles.title}>{title}</div>;
}

function renderFooter(id, props) {
  return (
    <div className={styles.footer}>
      <StopClickEventPropagation className={styles.cardAssignees}>
        <AssigneesController
          objectType={EntityType.TASK_DATA}
          objectId={id}
          maxAssigneesRenderCount={2}
          shouldRenderTitle={false}
          isEditable={true}
        />
      </StopClickEventPropagation>
      <TaskProgressWithPopover
        targetClassName={styles.taskProgress}
        buttonClassName={styles.taskProgressButton}
        hideOnEmpty
        taskId={id}
        color={props.color}
      />
    </div>
  );
}

export default CardEventTimeGrid;
