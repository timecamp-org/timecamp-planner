import { List } from 'immutable';
import ImmutablePropTypes from 'immutable-prop-types';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import Checkbox from 'commonComponents/Checkbox';
import HorizontalDivider from 'commonComponents/HorizontalDivider';
import MonthsShortDropdown from 'commonComponents/MonthsShortDropdown';
import PeriodDropdown from 'commonComponents/PeriodDropdown';
import PositionDropdown from 'commonComponents/PositionDropdown';
import UserInput from 'commonComponents/UserInput';
import PrimaryButton from 'components/buttons/PrimaryButton';
import SecondaryButton from 'components/buttons/SecondaryButton';
import DateOutput from 'components/date/DateOutput';
import ListsDropdown from 'components/taskList/ListsDropdown';
import { useTranslation } from 'i18n';
import colorStyles from 'styles/colors.css';

import { PeriodType, Position } from '../../../../common/types';
import { getWeekDaysShort } from '../../date/utils';

import styles from './styles.css';

const emptyList = new List();
const weekDays = new List(getWeekDaysShort());

CardRecurrencySettingsModalContent.propTypes = {
  selectedSetting: PropTypes.number,
  interval: PropTypes.number,
  dayOfMonth: PropTypes.number,
  period: PropTypes.string,
  weekDays: ImmutablePropTypes.list,
  selectedMonth: PropTypes.number,
  isDueDateEnabled: PropTypes.bool,
  dueDateOffset: PropTypes.number,
  dueDateOffsetPeriod: PropTypes.string,
  isSubmitEnabled: PropTypes.bool,
  nextRecurrenceAt: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  maxDayOfMonth: PropTypes.number,
  listIds: ImmutablePropTypes.list,
  selectedListId: PropTypes.string,
  selectedPosition: PropTypes.string,
  isUpdating: PropTypes.bool,

  onCloseModal: PropTypes.func,
  onSave: PropTypes.func,
  onSelectRecurrencySettings: PropTypes.func,
  onChangeInterval: PropTypes.func,
  onSelectPeriod: PropTypes.func,
  onSelectWeekDay: PropTypes.func,
  onChangeDayOfMonth: PropTypes.func,
  onSelectMonth: PropTypes.func,
  onSetIsDueDateEnabled: PropTypes.func,
  onChangeDueDateOffset: PropTypes.func,
  onSelectDueDateOffsetPeriod: PropTypes.func,
  onSelectPosition: PropTypes.func,
  onRemoveRecurrence: PropTypes.func,
};

CardRecurrencySettingsModalContent.defaultProps = {
  interval: 1,
  dayOfMonth: 1,
  weekDays: emptyList,
  period: PeriodType.MONTHLY,
  recurrenceTimes: 0,
  isDueDateEnabled: true,
  dueDateOffset: 1,
  maxDayOfMonth: 31,
  dueDateOffsetPeriod: PeriodType.MONTHLY,
  isSubmitEnabled: true,
  listIds: emptyList,
  selectedPosition: Position.TOP,
  isUpdating: false,

  onCloseModal: doNothing,
  onSave: doNothing,
  onSelectRecurrencySettings: doNothing,
  onChangeInterval: doNothing,
  onSelectPeriod: doNothing,
  onSelectWeekDay: doNothing,
  onChangeDayOfMonth: doNothing,
  onSelectMonth: doNothing,
  onSetIsDueDateEnabled: doNothing,
  onChangeDueDateOffset: doNothing,
  onSelectDueDateOffsetPeriod: doNothing,
  onSelectPosition: doNothing,
  onRemoveRecurrence: doNothing,
};

function CardRecurrencySettingsModalContent(props) {
  const { t } = useTranslation();
  return (
    <div className={props.className || styles.Component}>
      <div className={styles.title}>{t('Recurring Task')}</div>

      {renderForm(props, t)}
      {renderNextRecurrenceInfo(props, t)}
      <HorizontalDivider />
      {renderListDropdown(props, t)}
      {renderRecurrenceDueDateForm(props, t)}
      {renderFooter(props, t)}
    </div>
  );
}

function renderForm(props, t) {
  return (
    <div className={styles.form}>
      <div className={styles.inputRow}>
        <span className={styles.label}>{t('Repeat every')}</span>
        <UserInput
          type={'number'}
          innerClassName={styles.intervalInput}
          value={props.interval}
          min={1}
          onChange={props.onChangeInterval}
        />
        <PeriodDropdown
          className={styles.periodDropdown}
          color={props.color}
          selectedPeriod={props.period}
          onSelectPeriod={props.onSelectPeriod}
        />
      </div>
      {renderRepeatDetailedForm(props, t)}
    </div>
  );
}

function renderListDropdown(props, t) {
  return (
    <div className={styles.row}>
      <div className={styles.dropdownLabel}>{t('List')}</div>
      <div className={styles.listDropdownWrapper}>
        <ListsDropdown
          listIds={props.listIds}
          color={props.color}
          selectedListId={props.selectedListId}
          onSelectListId={props.onSelectListId}
        />
      </div>
      <PositionDropdown
        className={styles.positionDropdown}
        color={props.color}
        selectedPosition={props.selectedPosition}
        onSelectPosition={props.onSelectPosition}
      />
    </div>
  );
}

function renderRepeatDetailedForm(props, t) {
  return (
    <>
      {props.period !== PeriodType.DAILY && <span className={styles.label}>{t('Repeat on')}</span>}
      {renderRepeatDetailedInputs(props, t)}
    </>
  );
}

function renderRepeatDetailedInputs(props, t) {
  switch (props.period) {
    case PeriodType.WEEKLY:
      return renderWeeklyForm(props);
    case PeriodType.MONTHLY:
      return renderMonthlyForm(props, t);
    case PeriodType.YEARLY:
      return renderYearlyForm(props, t);
    default:
      return null;
  }
}

function renderWeeklyForm(props) {
  return (
    <div className={styles.weekDaysForm}>{weekDays.map((_, weekDayIdx) => renderWeekDayTile(props, weekDayIdx))}</div>
  );
}

function renderWeekDayTile(props, weekDayIdx) {
  const isSelected = props.weekDays.includes(weekDayIdx);
  return (
    <SecondaryButton
      key={weekDayIdx}
      className={styles.weekDay}
      color={props.color}
      style={{
        backgroundColor: isSelected ? props.color : null,
        color: isSelected ? colorStyles.whiteTwoColor : null,
      }}
      onClick={() => props.onSelectWeekDay(weekDayIdx)}
    >
      {weekDays.get(weekDayIdx)}
    </SecondaryButton>
  );
}

function renderMonthlyForm(props, t) {
  return (
    <div className={styles.dayOfMonthInputWrapper}>
      <UserInput
        type={'number'}
        innerClassName={styles.dayOfMonthInput}
        value={props.dayOfMonth}
        min={1}
        max={31}
        onChange={props.onChangeDayOfMonth}
      />
      <span>{t('day of month')}</span>
    </div>
  );
}

function renderYearlyForm(props, t) {
  return (
    <div className={styles.dayOfMonthInputWrapper}>
      <UserInput
        type={'number'}
        innerClassName={styles.dayOfMonthInput}
        value={props.dayOfMonth}
        min={1}
        max={props.maxDayOfMonth}
        onChange={props.onChangeDayOfMonth}
      />
      <span>{t('day of')}</span>
      <MonthsShortDropdown
        className={styles.monthsShortDropdown}
        selectedMonth={props.selectedMonth}
        color={props.color}
        onSelectMonth={props.onSelectMonth}
      />
    </div>
  );
}

function renderRecurrenceDueDateForm(props, t) {
  return (
    <div className={styles.recurrenceDueDateForm}>
      <span className={styles.label}>{t('Due date')}</span>
      <div className={styles.radioWithInputRow}>
        <Checkbox
          className={styles.checkbox}
          color={props.color}
          isChecked={props.isDueDateEnabled}
          onToggleStatus={() => props.onSetIsDueDateEnabled(!props.isDueDateEnabled)}
        />
        <UserInput
          type={'number'}
          innerClassName={styles.recurrenceDueDateOffsetInput}
          value={props.dueDateOffset}
          min={1}
          isDisabled={!props.isDueDateEnabled}
          onChange={props.onChangeDueDateOffset}
        />
        <PeriodDropdown
          className={styles.periodDropdown}
          color={props.color}
          selectedPeriod={props.dueDateOffsetPeriod}
          isDisabled={!props.isDueDateEnabled}
          onSelectPeriod={props.onSelectDueDateOffsetPeriod}
        />
        <span className={styles.greyedText}>{t('after task is created')}</span>
      </div>
    </div>
  );
}

function renderNextRecurrenceInfo(props, t) {
  return (
    <div className={styles.nextRecurrenceInfo}>
      <span className={styles.label}>{t(`Next recurrence: `)}</span>
      {props.nextRecurrenceAt ? (
        <DateOutput className={styles.dateOutput} timestamp={props.nextRecurrenceAt} format={'MMM D, YYYY'} />
      ) : (
        <span className={styles.dateOutput}>{t('Never')}</span>
      )}
    </div>
  );
}

function renderFooter(props, t) {
  return (
    <div className={styles.buttons}>
      {props.isUpdating && (
        <SecondaryButton className={styles.actionButton} color={props.color} onClick={props.onRemoveRecurrence}>
          {t('Remove recurrency')}
        </SecondaryButton>
      )}
      <PrimaryButton color={props.color} isDisabled={!props.isSubmitEnabled} onClick={props.onSave}>
        {props.isUpdating ? t('Update') : t('Done')}
      </PrimaryButton>
    </div>
  );
}

export default CardRecurrencySettingsModalContent;
