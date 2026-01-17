import React, { memo } from 'react';
import isEqual from 'date-fns/is_equal';
import get from 'lodash/get';

import CreateCardPopover from 'components/tasks/CreateCardPopover';
import { Views } from 'react-big-calendar';
import isWithinRange from 'date-fns/is_within_range';
import { TaskCreateSource } from 'models/domain/TasksModel/types';

import styles from './styles.css';

function DateCellWrapper(props) {
  let start = null;
  let end = null;
  if (props.dateRange) {
    start = props.dateRange.get('start');
    end = props.dateRange.get('end');
  }

  const isVisible = isCreateCardPopoverVisible(props, start);
  const targetClassName = `${getViewBasedClassName(props)} ${getDayClassName(props.value, start, end)}`;

  return isVisible ? (
    <CreateCardPopover
      targetClassName={targetClassName}
      projectId={props.projectId}
      startDate={start}
      dueDate={end}
      isPopoverOpened={isVisible}
      targetRenderer={props.children}
      newTimeOffset={getNewTimeOffset(props)}
      taskCreateSource={TaskCreateSource.CALENDAR}
      onClosePopover={props.onUnsetDateRange}
    />
  ) : (
    props.children
  );
}

// TODO: it's very messy and should be removed after react-big-calendar get their shit up and fix their api
function isCreateCardPopoverVisible(props, start) {
  const isStartDateEqual = isEqual(props.value, start);

  const nestedChildrenClassName = get(props, 'children.props.children.props.className');
  const childrenOwnerClassName = get(props, 'children._owner.return.pendingProps.className', '');

  const isChildrenLabel =
    nestedChildrenClassName === 'rbc-label' ||
    childrenOwnerClassName.includes('rbc-time-gutter') ||
    childrenOwnerClassName.includes('rbc-allday-cell');

  return isStartDateEqual && !isChildrenLabel;
}

function getViewBasedClassName(props) {
  if (props.currentView === Views.MONTH) {
    return 'rbc-day-bg';
  } else {
    return 'rbc-time-slot';
  }
}

function getNewTimeOffset(props) {
  return props.currentView === Views.MONTH ? 12 : 0;
}

function getDayClassName(day, start, end) {
  const isInRange = isWithinRange(day, start, end);
  return isInRange ? styles.selectedDay : '';
}

export default memo(DateCellWrapper);
