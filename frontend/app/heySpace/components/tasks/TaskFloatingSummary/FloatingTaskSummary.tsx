import { FC, MouseEventHandler, Ref, useRef, useState } from 'react';

import { throttle } from 'lodash';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

import TaskListItem from 'components/taskList/TaskListItem';
import * as RequestTypes from 'models/domain/RequestModel/constants/requestTypes';
import { selectRequestIsSuccess } from 'models/domain/RequestModel/selectors';
import { onFetchTaskDetails } from 'models/domain/TasksModel/actions';

import styles from './styles.css';

const THROTTLE_TIME = 100;

export const FloatingTaskSummary: ReactFCWithChildren<{ id: string }> = ({ id, children }) => {
  const dispatch = useDispatch();
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ left: '', top: '' });

  const isTaskDetailsLoaded = useSelector((state) =>
    selectRequestIsSuccess(state, {
      requestType: RequestTypes.getTaskDetails,
      objectId: id,
    }),
  );

  const onMouseMove: Ref<MouseEventHandler<HTMLDivElement>> = useRef(
    throttle(
      (ev) => {
        setTooltipPosition({ left: `${ev.clientX + 20}px`, top: `${ev.clientY + 20}px` });
      },
      THROTTLE_TIME,
      { leading: false },
    ),
  );

  const onMouseEnter = () => {
    setIsMouseOver(true);
    if (!isTaskDetailsLoaded) {
      dispatch(onFetchTaskDetails(id));
    }
  };

  const onMouseLeave = () => {
    setIsMouseOver(false);
    setTimeout(() => {
      setTooltipPosition({ top: '', left: '' });
    }, THROTTLE_TIME);
  };

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove.current}
      className={`${!isTaskDetailsLoaded && styles.loading}`}
    >
      {children}

      {isMouseOver &&
        isTaskDetailsLoaded &&
        createPortal(
          <div
            style={{
              top: tooltipPosition.top,
              left: tooltipPosition.left,
            }}
            className={styles.floatingTooltip}
          >
            <TaskListItem taskId={id} />
          </div>,
          document.querySelector('body'),
        )}
    </div>
  );
};
