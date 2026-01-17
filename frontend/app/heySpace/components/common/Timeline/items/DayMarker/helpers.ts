/* eslint-disable consistent-return */

import addMilliseconds from 'date-fns/add_milliseconds';
import subMilliseconds from 'date-fns/sub_milliseconds';

import { TimeMarkerPositionInterface, TimeRange } from './types';

export const calculateTimeMarkerPosition = ({
  mouseStartClientX,
  mouseStopClientX,
  offsetX,
  containerWidth,
}: {
  mouseStartClientX: number;
  mouseStopClientX: number;
  offsetX: number;
  containerWidth: number;
}): TimeMarkerPositionInterface =>
  mouseStopClientX >= mouseStartClientX
    ? {
        left: mouseStartClientX - offsetX,
        width: mouseStopClientX - mouseStartClientX,
      }
    : {
        right: containerWidth - (mouseStartClientX - offsetX),
        width: mouseStartClientX - mouseStopClientX,
      };

export const mapTimeMarkerPositionToStyles = ({ left, right, width }: TimeMarkerPositionInterface): string =>
  `${left ? `left:${left}` : `right:${right}`}px;width:${width}px;`;

const MS_PER_DAY = 24 * 3_600 * 1_000;
export const calculateTimeMarkerPositionToTimeRange = ({
  position: { width, left, right },
  containerStartTime,
  widthPerDay,
}: {
  position: TimeMarkerPositionInterface;
  containerStartTime: number;
  widthPerDay: number;
}): TimeRange => {
  const startOffset = left || right;
  const timeLeftOffset = ((startOffset % widthPerDay) / widthPerDay) * MS_PER_DAY;
  const timeRangeLength = (width / widthPerDay) * MS_PER_DAY;

  const firstIndicatedTime = addMilliseconds(containerStartTime, timeLeftOffset).getTime();

  const startTime = left ? firstIndicatedTime : subMilliseconds(firstIndicatedTime, timeRangeLength).getTime();

  return {
    startTime,
    endTime: addMilliseconds(startTime, timeRangeLength).getTime(),
  };
};
