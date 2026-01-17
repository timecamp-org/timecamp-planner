import React from 'react';
import PropTypes from 'prop-types';
import { gridCellSize } from 'styles/common.css';
import { doNothing } from 'common/utils';

import UniversalPopover from 'commonComponents/UniversalPopover';
import DatePicker from 'components/date/DatePicker';
import DateRangePicker from 'components/date/DateRangePicker';

import PopoverContent from 'commonComponents/PopoverContent';

DateController.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  localStateTimestamp: PropTypes.number,
  isDatePickerOpen: PropTypes.bool,
  shouldRenderClearButton: PropTypes.bool,
  isRangePicker: PropTypes.bool,

  onControllerClick: PropTypes.func,
  onCloseDatePicker: PropTypes.func,
  onClearDate: PropTypes.func,
  onChangeDate: PropTypes.func,
  onSelectTomorrow: PropTypes.func,
  onSelectNextWeek: PropTypes.func,
  onSelectNextMonth: PropTypes.func,
  renderTargetComponent: PropTypes.func.isRequired,
};

DateController.defaultProps = {
  isDatePickerOpen: false,
  shouldRenderClearButton: true,
  isRangePicker: false,

  onControllerClick: doNothing,
  onCloseDatePicker: doNothing,
  onClearDate: doNothing,
  onChangeDate: doNothing,
  onSelectTomorrow: doNothing,
  onSelectNextWeek: doNothing,
  onSelectNextMonth: doNothing,
  renderTargetComponent: doNothing,
};

function DateController(props) {
  if (!props.isDatePickerOpen) {
    return props.renderTargetComponent(props);
  }

  return (
    <UniversalPopover
      isPopoverOpened={props.isDatePickerOpen}
      targetComponent={props.renderTargetComponent(props)}
      popperComponent={renderPopoverContent(props)}
      popperPlacement={'bottom-end'}
      popperModifiers={{
        offset: {
          offset: `0, ${parseInt(gridCellSize, 10) * 2}`,
        },
      }}
    />
  );
}

function renderPopoverContent(props) {
  return (
    <PopoverContent
      onClickOutside={props.onCloseDatePicker}
      isVisible={props.isDatePickerOpen}
    >
      {props.isRangePicker
        ? renderDateRangePicker(props)
        : renderDatePicker(props)}
    </PopoverContent>
  );
}

function renderDatePicker(props) {
  return (
    <DatePicker
      color={props.color}
      date={
        props.localStateTimestamp
          ? new Date(props.localStateTimestamp)
          : new Date()
      }
      shouldRenderClearButton={props.shouldRenderClearButton}
      onClearDate={props.onClearDate}
      onChange={props.onChangeDate}
    />
  );
}

function renderDateRangePicker(props) {
  return (
    <DateRangePicker
      color={props.color}
      from={props.from}
      to={props.to}
      shouldResetOnClick
      onChange={props.onChangeDateRange}
    />
  );
}

export default DateController;
