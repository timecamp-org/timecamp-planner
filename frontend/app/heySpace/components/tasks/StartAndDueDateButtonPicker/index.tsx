import { FC, memo, ReactNode } from 'react';

import { Box, IconButton, SxProps } from '@mui/material';
import isBefore from 'date-fns/is_before';
import isSameDay from 'date-fns/is_same_day';

import DueDate from 'commonComponents/DueDate/index';
import { CalendarDays } from 'commonComponents/Icons/fontawesome/CalendarDays';
import { Xmark } from 'commonComponents/Icons/fontawesome/Xmark';
import PopoverContent from 'commonComponents/PopoverContent';
import StartDate from 'commonComponents/StartDate';
import TooltipedDisabledElement from 'commonComponents/TooltipedDisabledElement';
import UniversalPopover from 'commonComponents/UniversalPopover';
import PrimaryButton from 'components/buttons/PrimaryButton';
import { PropertyButton } from 'components/buttons/PropertyButton';
import SecondaryButton from 'components/buttons/SecondaryButton';
import DateRangePicker from 'components/date/DateRangePicker';
import { TranslateFunction } from 'i18n/types';
import { TaskInterface } from 'models/domain/TasksModel/types';

import { i18mark, useTranslation } from '../../../../common/i18n';

import useComponent, { StartAndDueDateButtonPickerHookInterface } from './hook';
import InputGroup from './InputGroup';
import styles from './styles.css';
import { DateInputGroup } from './types';

const colorPrimary500 = 'var(--color-primary-500)';

const popperModifiers = {
  offset: {
    offset: `0, 16`,
  },
  preventOverflow: {
    boundariesElement: 'window',
  },
};

export interface StartAndDueDateButtonPickerInterface {
  startDate?: number;
  dueDate?: number;
  color?: string;
  targetClassName?: string;
  format?: string;
  placeholder?: ReactNode;
  taskId?: string;
  isPickerOpen?: boolean;
  onDateRangeChange?: (fields: Pick<TaskInterface, 'startDate' | 'dueDate'>) => void;
  onSetIsPickerOpen?: (isPickerOpen: boolean) => void;
  targetRenderer?: (
    hook: StartAndDueDateButtonPickerHookInterface,
    props: Omit<StartAndDueDateButtonPickerInterface, 'targetRenderer'>
  ) => JSX.Element;
}

const boxWrapperStyles: SxProps = {
  justifyContent: 'flex-end',
  display: 'flex',
  color: 'var(--color-gray-600)',
  margin: 0,
  padding: 0,
  '&:*': {
    margin: 0,
    padding: 0,
  },
};

const defaultProps = {
  format: 'MMM, D',
  placeholder: i18mark('Start - Due'),
};
// @ts-ignore
const StartAndDueDateButtonPicker: FC<StartAndDueDateButtonPickerInterface> = (props) => {
  const { t } = useTranslation();
  const hook = useComponent(props);

  return renderPopover(hook, props, t);
};

function renderPopover(
  hook: StartAndDueDateButtonPickerHookInterface,
  props: StartAndDueDateButtonPickerInterface,
  t: TranslateFunction
) {
  const Target = props?.targetRenderer?.(hook, props) || renderTargetComponent(hook, props, t);

  return (
    <PopoverContent onClickOutside={hook.onClosePicker} isVisible={hook.isPickerOpen}>
      <UniversalPopover
        isPopoverOpened={hook.isPickerOpen}
        targetComponent={Target}
        targetClassName={styles.buttonWrapper}
        popperComponent={renderPopoverContent(hook, t)}
        popperContentWrapperClassName={styles.popoverWrapper}
        popperPlacement={'bottom'}
        popperModifiers={popperModifiers}
      />
    </PopoverContent>
  );
}

function renderPopoverContent(hook: StartAndDueDateButtonPickerHookInterface, t: TranslateFunction) {
  const selectEndDateOnly = hook.focusedInputType === DateInputGroup.DUE;
  const selectStartDateOnly = hook.focusedInputType === DateInputGroup.START;

  return (
    <div>
      <Box sx={boxWrapperStyles}>
        <IconButton onClick={() => hook.onSetIsPickerOpen(false)}>
          <Xmark />
        </IconButton>
      </Box>
      <DateRangePicker
        className={styles.datepickerWrapper}
        color={hook.color}
        footerRenderer={renderFooter}
        from={hook.startDate ? new Date(hook.startDate) : null}
        to={hook.dueDate ? new Date(hook.dueDate) : null}
        selectEndDateOnly={selectEndDateOnly}
        selectStartDateOnly={selectStartDateOnly}
        onChange={hook.onChangeDateRange}
        onReset={hook.onReset}
      />
    </div>
  );

  function renderFooter() {
    const isInvalidDate = hook.dueDate && hook.startDate && isBefore(hook.dueDate, hook.startDate);

    return (
      <div className={styles.form}>
        <div className={styles.inputGroups}>
          <InputGroup
            type={DateInputGroup.START}
            focusedInputType={hook.focusedInputType}
            label={t('Start')}
            color={colorPrimary500}
            date={hook.startDate}
            isVisible={hook.isStartTimeVisible}
            onChangeDate={hook.onChangeStartDate}
            onSetIsVisible={hook.onSetIsStartTimeVisible}
            onSetFocusedInput={hook.onSetFocusedInput}
            inputRef={hook.startInputRef}
          />
          <InputGroup
            type={DateInputGroup.DUE}
            focusedInputType={hook.focusedInputType}
            label={t('Due')}
            color={colorPrimary500}
            date={hook.dueDate}
            isVisible={hook.isDueTimeVisible}
            onChangeDate={hook.onChangeDueDate}
            onSetIsVisible={hook.onSetIsDueTimeVisible}
            onSetFocusedInput={hook.onSetFocusedInput}
            inputRef={hook.dueInputRef}
          />
        </div>

        <div className={styles.footer}>
          <SecondaryButton color={colorPrimary500} onClick={hook.onClearDate} className={styles.footerClearButton}>
            <span className={styles.footerLabel}> {t('Clear')}</span>
          </SecondaryButton>
          <TooltipedDisabledElement
            isDisabled={isInvalidDate}
            message={t(`Task start date must be earlier than due date`)}
          >
            <PrimaryButton
              className={styles.footerSaveButton}
              isDisabled={isInvalidDate}
              color={colorPrimary500}
              onClick={hook.onClosePicker}
            >
              {t('Save')}
            </PrimaryButton>
          </TooltipedDisabledElement>
        </div>
      </div>
    );
  }
}

function getContentRender(hook: StartAndDueDateButtonPickerHookInterface) {
  const isEmpty = !hook.startDate && !hook.dueDate;
  const isStartDateOnly = hook.startDate && !hook.dueDate;
  const isDatesSameDay = hook.startDate && hook.dueDate && isSameDay(hook.startDate, hook.dueDate);
  const isDueDateOnly = (!hook.startDate && hook.dueDate) || isDatesSameDay;
  const isRange = hook.startDate && hook.dueDate && !isDatesSameDay;

  if (isEmpty) {
    return renderPlaceholder;
  }
  if (isStartDateOnly) {
    return renderOnlyStartDate;
  }
  if (isDueDateOnly) {
    return renderOnlyDueDate;
  }
  if (isRange) {
    return renderDateRange;
  }
  return renderPlaceholder;
}
function renderTargetComponent(
  hook: StartAndDueDateButtonPickerHookInterface,
  props: StartAndDueDateButtonPickerInterface,
  t: TranslateFunction
) {
  const isEmpty = !hook.startDate && !hook.dueDate;
  const contentRenderer = getContentRender(hook);

  return (
    <PropertyButton
      onClick={() => hook.onSetIsPickerOpen(!hook.isPickerOpen)}
      isActive={hook.isPickerOpen}
      icon={<CalendarDays size="sm" />}
      hasProperty={!isEmpty}
    >
      <div
        className={styles.buttonWrapper}
        onMouseEnter={() => hook.onSetIsHovering(true)}
        onMouseLeave={() => hook.onSetIsHovering(false)}
      >
        {contentRenderer(hook, props, t)}
      </div>
    </PropertyButton>
  );
}

function renderOnlyStartDate(
  hook: StartAndDueDateButtonPickerHookInterface,
  props: StartAndDueDateButtonPickerInterface,
  t: TranslateFunction
) {
  return (
    <>
      <span className={styles.prefix}>{t('Start on')}</span>
      <StartDate className={styles.date} format={props.format} startDate={hook.startDate} />
    </>
  );
}

function renderOnlyDueDate(
  hook: StartAndDueDateButtonPickerHookInterface,
  props: StartAndDueDateButtonPickerInterface,
  t: TranslateFunction
) {
  return (
    <>
      <span className={styles.prefix}>{t('Due to')}</span>
      <DueDate className={styles.date} dueDate={hook.dueDate} isColorsHidden={hook.isHovering} format={props.format} />
    </>
  );
}

function renderDateRange(hook: StartAndDueDateButtonPickerHookInterface, props: StartAndDueDateButtonPickerInterface) {
  return (
    <>
      <StartDate className={styles.date} startDate={hook.startDate} format={props.format} />
      <span className={styles.divider}>{'-'}</span>
      <DueDate className={styles.date} dueDate={hook.dueDate} isColorsHidden={hook.isHovering} format={props.format} />
    </>
  );
}

function renderPlaceholder(
  hook: StartAndDueDateButtonPickerHookInterface,
  props: StartAndDueDateButtonPickerInterface
) {
  return <span>{props.placeholder}</span>;
}

StartAndDueDateButtonPicker.defaultProps = defaultProps;

export default memo(StartAndDueDateButtonPicker);
