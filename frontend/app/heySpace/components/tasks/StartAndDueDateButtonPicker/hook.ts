import { Ref, useCallback, useEffect, useRef, useState } from 'react';

import getHours from 'date-fns/get_hours';
import getMinutes from 'date-fns/get_minutes';
import setHours from 'date-fns/set_hours';
import setMinutes from 'date-fns/set_minutes';
import isEmpty from 'lodash/isEmpty';

import useElementOpen from 'common/hooks/useElementOpen';
import usePrevious from 'common/hooks/usePrevious';
import { getDayEndTimestampFromDate, getDayStartTimestampFromDate, isStartOfDay } from 'common/utils/dateOperations';
import { DateChange } from 'components/date/DateInput/types';

import { DateInputGroup } from './types';

import { StartAndDueDateButtonPickerInterface } from '.';

export type StartAndDueDateButtonPickerHookInterface = {
  startDate: number;
  dueDate: number;
  isStartTimeVisible: boolean;
  isDueTimeVisible: boolean;
  isHovering: boolean;
  focusedInputType: DateInputGroup;

  isPickerOpen?: boolean;
  color: string;

  onSetIsPickerOpen?: (isOpen: boolean) => void;
  onClosePicker: VoidFunction;
  onClearDate: VoidFunction;
  onChangeDateRange: (rangeChange: DateRangeChange) => void;
  onChangeStartDate: (dateChange: DateChange) => void;
  onChangeDueDate: (dateChange: DateChange) => void;
  onSetIsStartTimeVisible: (isVisible: boolean) => void;
  onSetIsDueTimeVisible: (isVisible: boolean) => void;
  onSetFocusedInput: (focusedInputType: DateInputGroup) => void;
  onSetIsHovering: (isHovering: boolean) => void;
  onReset: VoidFunction;
  startInputRef: Ref<HTMLInputElement>;
  dueInputRef: Ref<HTMLInputElement>;
};

type DateRange = {
  startDate?: number;
  dueDate?: number;
};

type DateRangeChange = {
  from?: Date;
  to?: Date;
};

export default function useComponent({
  dueDate,
  startDate,
  color,
  onDateRangeChange,
  ...props
}: StartAndDueDateButtonPickerInterface): StartAndDueDateButtonPickerHookInterface {
  const pickerElementOpenHook = useElementOpen();
  const isPickerOpen = props.isPickerOpen === undefined ? pickerElementOpenHook.isOpen : props.isPickerOpen;
  const onSetIsPickerOpen = props.onSetIsPickerOpen || pickerElementOpenHook.onSetIsOpen;
  const { isOpen: isStartTimeVisible, onSetIsOpen: onSetIsStartTimeVisible } = useElementOpen(!isStartOfDay(startDate));
  const { isOpen: isDueTimeVisible, onSetIsOpen: onSetIsDueTimeVisible } = useElementOpen(!isStartOfDay(dueDate));
  const [localStartDate, onSetLocalStartDate] = useState(startDate);
  const [localDueDate, onSetLocalDueDate] = useState(dueDate);
  const [focusedInputType, onSetFocusedInput] = useState(startDate ? DateInputGroup.DUE : DateInputGroup.START);
  const [isHovering, onSetIsHovering] = useState(false);

  const prevIsPickerOpen = usePrevious(isPickerOpen);

  const startInputRef = useRef<HTMLInputElement>();
  const dueInputRef = useRef<HTMLInputElement>();
  const focusStartTimeout = useRef<number>();
  const focusDueTimeout = useRef<number>();

  const onSaveDateRange = useCallback(() => {
    const dateRange: DateRange = {};

    if (startDate !== localStartDate) {
      dateRange.startDate = localStartDate;
    }

    if (dueDate !== localDueDate) {
      dateRange.dueDate = localDueDate;
    }

    if (!isEmpty(dateRange)) {
      onDateRangeChange?.(dateRange);
    }
  }, [startDate, dueDate, localStartDate, localDueDate, onDateRangeChange]);

  const onRefreshTimeInputs = useCallback(() => {
    onSetIsStartTimeVisible(!isStartOfDay(localStartDate));
    onSetIsDueTimeVisible(!isStartOfDay(localDueDate));
  }, [localStartDate, localDueDate, onSetIsStartTimeVisible, onSetIsDueTimeVisible]);

  const onClosePicker = useCallback(
    (shouldUpdateTask: boolean = true) => {
      onSetIsPickerOpen(false);
      if (shouldUpdateTask) {
        onSaveDateRange();
      }
      onRefreshTimeInputs();
    },
    [onSetIsPickerOpen, onSaveDateRange, onRefreshTimeInputs]
  );

  const onClearDate = useCallback(() => {
    onSetLocalDueDate(null);
    onSetLocalStartDate(null);
    const isRangeChanged = startDate !== null || dueDate !== null;
    if (isRangeChanged) {
      onDateRangeChange?.({ startDate: null, dueDate: null });
    }
    onClosePicker(false);
  }, [startDate, dueDate, onSetLocalDueDate, onSetLocalStartDate, onDateRangeChange, onClosePicker]);

  const onFocusStartInput = useCallback(() => {
    focusStartTimeout.current = window.setTimeout(() => {
      if (startInputRef) {
        startInputRef.current.focus();
      }
    });
  }, []);

  const onFocusDueInput = useCallback(() => {
    focusDueTimeout.current = window.setTimeout(() => {
      if (dueInputRef) {
        dueInputRef.current.focus();
      }
    });
  }, []);

  const onChangeDateRange = useCallback(
    ({ from, to }: DateRangeChange) => {
      const preparedStartDate = from
        ? localStartDate
          ? getTimeWithPresetHour(from, localStartDate)
          : getDayStartTimestampFromDate(from)
        : null;
      const preparedDueDate = to
        ? localDueDate
          ? getTimeWithPresetHour(to, localDueDate)
          : getDayEndTimestampFromDate(to)
        : null;
      onSetLocalStartDate(preparedStartDate);
      onSetLocalDueDate(preparedDueDate);

      if (from && !to) {
        onFocusDueInput();
      } else if (!from && !to) {
        onFocusStartInput();
      } else if (!from && focusedInputType !== DateInputGroup.DUE) {
        onFocusStartInput();
      }
    },
    [localStartDate, localDueDate, focusedInputType, onFocusDueInput, onFocusStartInput]
  );

  const onChangeStartDate = useCallback(
    ({ parsedValue }: DateChange) => {
      if (Number.isNaN(parsedValue)) {
        return;
      }
      onSetLocalStartDate(parsedValue);
    },
    [onSetLocalStartDate]
  );

  const onChangeDueDate = useCallback(
    ({ parsedValue }: DateChange) => {
      if (Number.isNaN(parsedValue)) {
        return;
      }
      onSetLocalDueDate(parsedValue);
    },
    [onSetLocalDueDate]
  );

  const onReset = useCallback(() => {
    switch (focusedInputType) {
      case DateInputGroup.DUE: {
        onFocusStartInput();
        break;
      }
      default:
        break;
    }
  }, [focusedInputType, onFocusStartInput]);

  useEffect(() => {
    if (!prevIsPickerOpen && isPickerOpen) {
      if (startDate) {
        onFocusDueInput();
      } else {
        onFocusStartInput();
      }
    }
  }, [isPickerOpen, prevIsPickerOpen, startDate, onFocusDueInput, onFocusStartInput]);

  useEffect(
    () => () => {
      if (focusStartTimeout.current) {
        clearTimeout(focusStartTimeout.current);
      }
      if (focusDueTimeout.current) {
        clearTimeout(focusDueTimeout.current);
      }
    },
    []
  );

  return {
    color,
    startDate: localStartDate,
    dueDate: localDueDate,
    isDueTimeVisible,
    isStartTimeVisible,
    isPickerOpen,
    focusedInputType,
    isHovering,
    onChangeDateRange,
    onChangeDueDate,
    onChangeStartDate,
    onClearDate,
    onClosePicker,
    onReset,
    onSetFocusedInput,
    onSetIsDueTimeVisible,
    onSetIsPickerOpen,
    onSetIsStartTimeVisible,
    onSetIsHovering,
    dueInputRef,
    startInputRef,
  };
}

function getTimeWithPresetHour(date: Date, localDate: number): number {
  if (!localDate) {
    return date.getTime();
  }

  const hours = getHours(localDate);
  const minutes = getMinutes(localDate);

  return setMinutes(setHours(date, hours), minutes).getTime();
}
