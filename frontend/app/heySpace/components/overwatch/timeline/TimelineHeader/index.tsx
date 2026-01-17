import React from 'react';

import { differenceInDays, isToday } from 'date-fns';
import { Moment } from 'moment';

import { AnyDict } from 'common/types';
import { format } from 'common/utils/dateOperations';
import { HEADER_ITEM_CLASS_NAME } from 'commonComponents/Timeline/extensions/constants';
import { getConditionalClass } from 'utils/getConditionalClass';

import styles from './styles.css';

export type TimelineHeaderInterface = AnyDict;

const TimelineHeader: React.FC<TimelineHeaderInterface> = (props) => {
  const { startTime } = props.interval;
  const shouldRenderMonthLabel = props.timelineBaseUnit === 'month';
  const shouldDisplayFullWeekDay = differenceInDays(props.visibleTimeEnd, props.visibleTimeStart) < 15;

  return (
    <div
      className={`${HEADER_ITEM_CLASS_NAME} ${styles.timelineHeaderItem}`}
      {...props.reactCalendarTimelineInternalProps}
    >
      {renderHeaderContent(startTime, shouldRenderMonthLabel, shouldDisplayFullWeekDay)}
    </div>
  );
};

function renderHeaderContent(startTime: Moment, shouldRenderMonthLabel: boolean, shouldDisplayFullWeekDay: boolean) {
  const isDateToday = isToday(startTime.toDate());
  if (shouldRenderMonthLabel) {
    return (
      <>
        <span className={styles.topLabel}>{format(startTime.toDate(), 'MMMM')}</span>
        <span className={styles.bottomLabel}>{format(startTime.toDate(), 'YYYY')}</span>
      </>
    );
  } else {
    return (
      <>
        <span className={`${styles.topLabel} ${getConditionalClass(styles.today, isDateToday)}`}>
          {format(startTime.toDate(), 'D')}
        </span>
        <span className={styles.bottomLabel}>
          {format(startTime.toDate(), `${shouldDisplayFullWeekDay ? 'dddd' : 'ddd'}`)}
        </span>
      </>
    );
  }
}

export default TimelineHeader;
