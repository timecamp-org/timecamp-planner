import { i18n } from 'common/i18n';
import { DurationInterface } from 'models/domain/TaskTimeEstimateModel/types';

export function parseMinutesToDuration(minutesInput: number): DurationInterface {
  const hours = Math.floor(minutesInput / 60);
  const minutes = minutesInput % 60;

  return {
    hours,
    minutes,
  };
}

export const getDurationHumanText = ({ hours, minutes }: DurationInterface) => {
  const t = i18n?.t.bind(i18n);

  // eslint-disable-next-line consistent-return
  return `${hours ? `${hours}${t('h')} ` : ''}${minutes ? `${minutes}${t('m')}` : ''}`;
};
