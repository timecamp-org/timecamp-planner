import { doNothing } from 'common/utils';
import PropTypes from 'prop-types';
import colorStyles from 'styles/colors.css';
import styles from './styles.css';

import commonStyles from 'styles/common.css';

import { ChevronLeft, ChevronRight } from 'commonComponents/Icons';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { i18n } from 'i18n';
import DayPicker from 'react-day-picker';
import { getMonths, getWeekDaysLong, getWeekDaysShort } from '../utils';
//import 'react-day-picker/lib/style.css';

DatePicker.propTypes = {
  color: PropTypes.string,
  className: PropTypes.string,
  date: PropTypes.instanceOf(Date),
  firstDayOfWeek: PropTypes.number,
  modifiers: PropTypes.object,
  shouldRenderClearButton: PropTypes.bool,
  currentUserLocale: PropTypes.string,

  quickDateOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    }),
  ),
  onChange: PropTypes.func,
  onClearDate: PropTypes.func,
  onDayMouseEnter: PropTypes.func,
  onDayMouseLeave: PropTypes.func,
  onDayClick: PropTypes.func,
  onClickOutside: PropTypes.func,
  onPreviousClick: PropTypes.func,
  onNextClick: PropTypes.func,
};

DatePicker.defaultProps = {
  color: colorStyles.dodgerBlueColor,
  shouldRenderClearButton: false,
  currentUserLocale: 'en',
  onChange: doNothing,
  onClearDate: doNothing,
  onDayMouseEnter: doNothing,
  onDayMouseLeave: doNothing,
  onDayClick: doNothing,
  onClickOutside: doNothing,
  onPreviousClick: doNothing,
  onNextClick: doNothing,
};

function DatePicker(props) {
  const modifiers = {
    ...props.modifiers,
    selected: props.date,
    today: props.shouldDisplayAsToday,
  };
  return (
    <div className={props.className || styles.datePicker}>
      <DayPicker
        ref={props.onSetRef}
        classNames={styles}
        selectedDays={props.date}
        locale={i18n.language}
        months={getMonths()}
        weekdaysLong={getWeekDaysLong()}
        weekdaysShort={getWeekDaysShort()}
        month={props.date}
        fixedWeeks
        showOutsideDays
        enableOutsideDaysClick
        modifiers={modifiers}
        modifiersStyles={{
          today: {
            color: commonStyles.wisteriaColor,
            fontWeight: commonStyles.regularFontWeight,
          },
          highlighted: {
            background: commonStyles.wisteria50Color,
            color: commonStyles.whiteTwoColor,
          },
          selected: {
            background: props.color,
            color: commonStyles.whiteTwoColor,
          },
          outside: {
            color: commonStyles.black60Color,
          },
        }}
        navbarElement={renderNavbar}
        onDayClick={props.onDayClick}
        onDayMouseEnter={props.onDayMouseEnter}
        onDayMouseLeave={props.onDayMouseLeave}
      />
      {props.quickDateOptions ? renderQuickDateOptions() : null}
      {props.shouldRenderClearButton ? renderClearButton() : null}
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

  function renderQuickDateOptions() {
    return <div className={styles.quickButtons}>{props.quickDateOptions.map(renderQuickDateOption)}</div>;
  }

  function renderQuickDateOption(option) {
    return (
      <div key={option.label} onClick={option.onClick} className={styles.quickButton}>
        {option.label}
      </div>
    );
  }

  function renderClearButton() {
    return (
      <div className={styles.bottomButtons}>
        <SecondaryButton color={props.color} className={styles.buttonClear} onClick={props.onClearDate}>
          <span style={{ color: props.color }}>{i18n.t('Clear')}</span>
        </SecondaryButton>
      </div>
    );
  }
}

export default DatePicker;
