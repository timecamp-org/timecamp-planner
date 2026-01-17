/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { CSSProperties, FC } from 'react';

import { isWeekend } from 'date-fns';

import { brightRedColor, jungleGreenColor } from 'common/commonStyles/colors';
import { TaskTimelineItem } from 'models/domain/TasksModel/types';

import styles from './styles.css';

const blockEvent: React.MouseEventHandler<HTMLDivElement> = (e) => e.stopPropagation();

// TODO replace with user work time settings
const WORK_TIME = 8;

interface DayMarkerItemInterface extends TaskTimelineItem {
  hours?: number;
  userId?: string;
}

interface DayMarkerInterface {
  item: DayMarkerItemInterface;
  scrollRef: HTMLElement;
  wrapperRef: HTMLElement;
}

const MarkerWrapper: ReactFCWithChildren<{ style: CSSProperties }> = ({ style }) => (
  <div onClick={blockEvent} onDoubleClick={blockEvent} className={styles.marker}></div>
);

export const DayMarker: FC<DayMarkerInterface> = ({
  item: { hours, start_time, group, userId },
  scrollRef,
  wrapperRef,
}) => {
  if (!hours) {
    const groupRef = document.querySelector(`[data-user-id="${group}"]`);
    const boardWrapper = document.querySelector('.rct-outer');

    const height = groupRef ? `${groupRef.clientHeight}px` : `${scrollRef?.clientHeight}px`;
    const top = groupRef ? `${groupRef.getBoundingClientRect().y - boardWrapper.getBoundingClientRect().y}px` : '0';

    return <MarkerWrapper style={{ height, top }}></MarkerWrapper>;
  }

  const isWorkingDay = !isWeekend(start_time);
  const color = hours <= WORK_TIME ? jungleGreenColor : brightRedColor;
  const timeText = hours <= WORK_TIME ? `${WORK_TIME - hours}` : `+${hours - WORK_TIME}`;

  return (
    <MarkerWrapper style={{ color }}>
      {isWorkingDay ? (hours === 0 ? WORK_TIME : timeText) : hours ? timeText : ''}
    </MarkerWrapper>
  );
};
