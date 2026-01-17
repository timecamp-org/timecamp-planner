import { useState } from 'react';

import { Button } from '@mui/material';
import addDays from 'date-fns/add_days';
import isSameDay from 'date-fns/is_same_day';
import subDays from 'date-fns/sub_days';
import PropTypes from 'prop-types';
import DayPicker from 'react-day-picker';

import { doNothing } from 'common/utils';
import { getColorWithAlpha } from 'common/utils/colors';
import { ChevronLeft } from 'commonComponents/Icons/fontawesome/ChevronLeft';
import { ChevronRight } from 'commonComponents/Icons/fontawesome/ChevronRight';
import { i18n } from 'i18n';
import colorStyles from 'styles/colors.css';
import commonStyles from 'styles/common.css';

//import 'react-day-picker/lib/style.css';
import { getIsTodayInRange, getMonths, getWeekDaysLong, getWeekDaysShort } from '../utils';

import styles from './styles.css';

const colorPrimary500 = 'var(--color-primary-500)';
const colorGray100 = 'var(--color-gray-100)';

DateRangePicker.propTypes = {
  color: PropTypes.string,
  className: PropTypes.string,
  date: PropTypes.instanceOf(Date),
  firstDayOfWeek: PropTypes.number,
  modifiers: PropTypes.object,
  shouldRenderClearButton: PropTypes.bool,
  currentUserLocale: PropTypes.string,

  footerRenderer: PropTypes.func,
  onClearDate: PropTypes.func,
  onDayMouseEnter: PropTypes.func,
  onDayMouseLeave: PropTypes.func,
  onDayClick: PropTypes.func,
  onClickOutside: PropTypes.func,
  onPreviousClick: PropTypes.func,
  onNextClick: PropTypes.func,
};

DateRangePicker.defaultProps = {
  color: colorStyles.dodgerBlueColor,
  shouldRenderClearButton: false,
  currentUserLocale: 'en',
  onClearDate: doNothing,
  onDayMouseEnter: doNothing,
  onDayMouseLeave: doNothing,
  onDayClick: doNothing,
  onClickOutside: doNothing,
  onPreviousClick: doNothing,
  onNextClick: doNothing,
};
const pastMonth = new Date(2020, 10, 15);
function DateRangePicker(props) {
  const defaultSelected = {
    from: pastMonth,
    to: addDays(pastMonth, 4),
  };
  const [range, setRange] = useState(defaultSelected);

  return (
    <div className={props.className || styles.datePicker}>
      <DayPicker
        selected={range}
        onSelect={setRange}
        ref={props.onSetRef}
        classNames={styles}
        disabledDays={props.disabledDays}
        selectedDays={props.selectedDays}
        locale={i18n.language}
        months={getMonths()}
        mode="range"
        weekdaysLong={getWeekDaysLong()}
        weekdaysShort={getWeekDaysShort()}
        month={props.date}
        fromMonth={new Date(0)}
        showOutsideDays
        enableOutsideDaysClick
        modifiers={getModifiers(props)}
        modifiersStyles={getModifierStyles(props)}
        navbarElement={renderNavbar}
        onDayClick={props.onDayClick}
        onDayMouseEnter={props.onDayMouseEnter}
        onDayMouseLeave={props.onDayMouseLeave}
        initialMonth={props?.from || new Date()}
      />

      {props.shouldRenderClearButton ? renderClearButton() : null}
      {props.footerRenderer && props.footerRenderer(props)}
    </div>
  );

  function renderNavbar(innerProps) {
    return (
      <div className={styles.customNavBar}>
        <ChevronLeft className={styles.prevIcon} onClick={() => innerProps.onPreviousClick()} />
        <ChevronRight className={styles.nextIcon} onClick={() => innerProps.onNextClick()} />
      </div>
    );
  }

  function renderClearButton() {
    return (
      <div className={styles.bottomButtons}>
        <Button variant="text" color={props.color} className={styles.buttonClear} onClick={props.onClearDate}>
          <span style={{ color: props.color }}>{i18n.t('Clear')}</span>
        </Button>
      </div>
    );
  }
}

function getModifiers(props) {
  return {
    ...props.modifiers,
    selected: isSameDay(props.from, props.to)
      ? props.from
      : {
          from: props.from ? addDays(props.from, 1) : null,
          to: props.enteredTo ? subDays(props.enteredTo, 1) : null,
        },
    today: props.shouldDisplayAsToday,
  };
}

function getModifierStyles(props) {
  const isTodayInRange = getIsTodayInRange(props);

  return {
    today: {
      color: isTodayInRange ? colorGray100 : colorPrimary500,
      fontWeight: commonStyles.boldFontWeight,
    },
    highlighted: {
      background: getColorWithAlpha(props.color, 0.5),
      color: commonStyles.whiteTwoColor,
    },
    selected: {
      background: colorPrimary500,
      color: commonStyles.whiteTwoColor,
    },
    start: {
      background: colorPrimary500,
      color: commonStyles.whiteTwoColor,
      borderRadius: '8px 0 0 8px',
    },
    end: {
      background: colorPrimary500,
      color: commonStyles.whiteTwoColor,
      borderRadius: '0 8px 8px 0',
    },
    outside: {
      color: commonStyles.black60Color,
    },
  };
}

export default DateRangePicker;
