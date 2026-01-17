/* eslint-disable consistent-return */

import { differenceInMilliseconds } from 'date-fns';
import addMilliseconds from 'date-fns/add_milliseconds';

import { TimeMarkerPositionInterface, TimeRange } from './types';

export const calculateTimeMarkerPosition = ({
  mouseStartClientX,
  mouseStopClientX,
  offsetX,
  offsetY,
  screenWidth,
  containerHeight,
}: {
  mouseStartClientX: number;
  mouseStopClientX: number;
  offsetX: number;
  offsetY: number;
  screenWidth: number;
  containerHeight: number;
}): TimeMarkerPositionInterface =>
  mouseStopClientX >= mouseStartClientX
    ? {
        left: mouseStartClientX,
        width: mouseStopClientX - mouseStartClientX,
        height: containerHeight,
        top: offsetY,
      }
    : {
        right: screenWidth - mouseStartClientX,
        width: mouseStartClientX - mouseStopClientX,
        height: containerHeight,
        top: offsetY,
      };

export const mapTimeMarkerPositionToStyles = ({
  left,
  right,
  width,
  height,
  top,
}: TimeMarkerPositionInterface): string =>
  `${left ? `left:${left}` : `right:${right}`}px;width:${width}px;top:${top}px;height:${height}px`;

export const calculateTimeMarkerPositionToTimeRange = ({
  position: { width, left, right },
  containerStartTime,
  containerEndTime,
  headerLeftOffset,
  screenWidth,
  headerWidth,
}: {
  position: TimeMarkerPositionInterface;
  headerLeftOffset: number;
  containerStartTime: number;
  containerEndTime: number;
  headerWidth: number;
  screenWidth: number;
}): TimeRange => {
  const timePerPx = differenceInMilliseconds(containerEndTime, containerStartTime) / headerWidth;

  const startOffset = left - headerLeftOffset || screenWidth - (right + width + headerLeftOffset);

  const timeLeftOffset = startOffset * timePerPx;

  const timeSpan = width * timePerPx;

  const timeStart = addMilliseconds(containerStartTime, timeLeftOffset).getTime();

  return {
    timeStart,
    timeEnd: addMilliseconds(timeStart, timeSpan).getTime(),
  };
};

export const extractPrefixedValue = (text: string, prefix: string) => {
  const regex = new RegExp(`${prefix}(\\S+)`);
  const match = text.match(regex);

  return match ? match[1] : '';
};
