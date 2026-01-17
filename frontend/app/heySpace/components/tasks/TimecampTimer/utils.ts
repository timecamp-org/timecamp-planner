import { format } from 'date-fns';

export const parseDurationStringToSeconds = (duration: string) => {
  const [hours, minutes] = duration.split(':').map(Number);

  return minutes * 60 + hours * 3600;
};

const dateFormat = 'YYYY-MM-DD';
export const mergeTimeWithDay = (time: string, day: Date) => new Date(`${time} ${format(day, dateFormat)}`);
