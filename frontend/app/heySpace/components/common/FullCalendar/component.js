import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { doNothing } from 'common/utils';
import { i18n } from 'i18n';
import { dateNow } from 'common/utils/date';
import { format } from 'common/utils/dateOperations';
import merge from 'lodash/merge';
import isWithinRange from 'date-fns/is_within_range';

import { Views, Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment/min/moment-with-locales';
import { DEFAULT_OFFSET } from 'models/component/FullCalendarModel/constants';
import 'moment/locale/pl';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

import styles from './assets/styles.css';
import './assets/calendar.css';
import './assets/dnd.css';

import getMessages from './messages';
import colorStyles from 'styles/colors.css';
import MonthDateHeader from './MonthDateHeader';
import { getConditionalClass } from 'utils/getConditionalClass';

FullCalendar.propTypes = {
  className: PropTypes.string,
  events: PropTypes.array,
  components: PropTypes.object,
  resizable: PropTypes.bool,
  color: PropTypes.string,
  format: PropTypes.string,
  selectable: PropTypes.bool,
  popup: PropTypes.bool,
  date: PropTypes.object,
  view: PropTypes.string,
  length: PropTypes.number,

  onEventClick: PropTypes.func,
  onDateClick: PropTypes.func,
  onEventDrop: PropTypes.func,
  onEventResize: PropTypes.func,
  onChangeView: PropTypes.func,
};

FullCalendar.defaultProps = {
  className: '',
  events: [],
  components: undefined,
  resizable: true,
  selectable: true,
  color: colorStyles.wisteriaColor,
  popup: true,
  length: DEFAULT_OFFSET,

  onEventClick: doNothing,
  onDateClick: doNothing,
  onEventDrop: doNothing,
  onEventResize: doNothing,
  onChangeView: doNothing,
};

moment.locale(i18n.language, {
  week: {
    dow: 1,
  },
});
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const components = {
  month: {
    dateHeader: MonthDateHeader,
  },
};

function FullCalendar(props) {
  const [view, onSetView] = useState(Views.MONTH);
  const [date, onSetDate] = useState(dateNow());
  const mergedComponents = merge(components, props.components);
  const formats = {
    agendaHeaderFormat: ({ start, end }) => `${format(start, props.format)} - ${format(end, props.format)}`,
    weekdayFormat: (date) => moment(date).format('dddd'),
  };

  return (
    <div className={props.className || styles.Component}>
      <DnDCalendar
        defaultView={Views.MONTH}
        view={props.view || view}
        defaultDate={dateNow()}
        date={props.date || date}
        localizer={localizer}
        events={props.events}
        resizable={props.resizable}
        selectable={props.selectable}
        popup={props.popup}
        length={props.length}
        eventPropGetter={props.eventPropGetter}
        dayPropGetter={getSlotProps}
        slotPropGetter={getSlotProps}
        components={mergedComponents}
        messages={getMessages()}
        formats={formats}
        onEventDrop={props.onEventDrop}
        onEventResize={props.onEventResize}
        onSelectSlot={props.onDateClick}
        onSelectEvent={props.onEventClick}
        onView={onChangeView}
        onNavigate={onSetDate}
      />
    </div>
  );

  function onChangeView(newView) {
    onSetView(newView);
    props.onChangeView(newView);
  }

  function getSlotProps(day) {
    let start;
    let end;
    if (props.dateRange) {
      start = props.dateRange.get('start');
      end = props.dateRange.get('end');
    }
    const isInRange = props.dateRange && isWithinRange(day, start, end);
    const isWeekend = [0, 6].includes(day.getDay());

    return {
      className: isInRange ? styles.selectedDay : getConditionalClass(styles.weekend, isWeekend),
    };
  }
}

export default FullCalendar;
