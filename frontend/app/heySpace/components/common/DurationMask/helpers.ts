import { add } from 'lodash';

import { parseMinutesToDuration } from 'common/utils/duration';

const DECIMAL_TIME_SEPARATOR_REGEXP = /[,.]/;
const SEXAGESIMAL_TIME_SEPARATOR_REGEXP = /[:\-h]/;

export function parseTimeString(input: string) {
  const numberInput = Number(input);
  const isValidNumber = Number.isFinite(numberInput);

  if (isValidNumber && numberInput <= 24) {
    return { hours: numberInput, minutes: 0 };
  }

  if (isValidNumber) {
    return parseMinutesToDuration(numberInput);
  }

  const onlyMinutes = Number(input.replace('m', ''));
  if (Number.isFinite(onlyMinutes)) {
    return { hours: 0, minutes: onlyMinutes };
  }

  if (input.match(DECIMAL_TIME_SEPARATOR_REGEXP)) {
    const [hours, minutesDecimal] = input.split(DECIMAL_TIME_SEPARATOR_REGEXP).map(Number);

    const minutes = Number(`0.${minutesDecimal}`) * 60;

    return { hours, minutes };
  }

  const [hours, minutes] = input
    .split(SEXAGESIMAL_TIME_SEPARATOR_REGEXP)
    .map((val) => val.replace('m', ''))
    .map(Number);

  return { hours, minutes };
}

export const parseTimeStringToMinutes = (input: string): number => {
  const { hours, minutes } = parseTimeString(input);

  return add(hours * 60, minutes);
};
