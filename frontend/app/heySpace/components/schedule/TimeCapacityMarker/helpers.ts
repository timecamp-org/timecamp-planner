/* eslint-disable consistent-return */

import { endOfDay, startOfDay } from 'date-fns';
import { throttle } from 'lodash';

import styles from './styles.css';
import { TimeMarkerPositionInterface, TimeRange } from './types';

export const calculateTimeMarkerPosition = ({
  mousePosition,
  parentLeftOffset,
  parentWidth,
  startPosition,
}: {
  startPosition: number;
  parentLeftOffset: number;
  mousePosition: number;
  parentWidth: number;
}): TimeMarkerPositionInterface =>
  mousePosition >= parentLeftOffset
    ? {
        left: startPosition - parentLeftOffset,
        width: mousePosition - startPosition,
      }
    : {
        right: parentLeftOffset + parentWidth - startPosition,
        width: startPosition - mousePosition,
      };

export const mapTimeMarkerPositionToStyles = ({ left, right, width }: TimeMarkerPositionInterface): string =>
  `${left ? `left: ${left}` : `right: ${right}`}px; width: ${width}px;`;

const dayMs = 24 * 3_600 * 1_000;
export const mapTimeMarkerPositionToTimeRange = ({
  position: { width, left, right },
  containerStartTime,
  widthPerDay,
}: {
  position: TimeMarkerPositionInterface;
  containerStartTime: number;
  widthPerDay: number;
}): TimeRange => {
  const startOffset = left || right - widthPerDay;
  const timeRangeLength = ((width + startOffset) / widthPerDay) * dayMs;

  return {
    startTime: startOfDay(left ? containerStartTime : containerStartTime - timeRangeLength).getTime(),
    endTime: endOfDay(left ? containerStartTime + timeRangeLength : containerStartTime).getTime(),
  };
};

interface CreateOnMarkerMouseDownInterface {
  scrollRef: HTMLElement;
  onSelectionEnd: (timeRange: TimeRange) => void;
  startTime: number;
}

export const createOnMarkerMouseDown =
  ({ onSelectionEnd, scrollRef, startTime }: CreateOnMarkerMouseDownInterface) =>
  (mouseDownEvent: MouseEvent) => {
    const { clientX: startPosition } = mouseDownEvent;
    const marker = document.createElement('div');
    marker.classList.add(styles.newItemIndicator);
    const dayMarkerNode = mouseDownEvent.target as HTMLDivElement;
    const { left: parentLeftOffset, width: parentWidth } = dayMarkerNode.getBoundingClientRect();
    dayMarkerNode.appendChild(marker);

    const mouseMoveHandler = throttle(({ clientX: mousePosition }: MouseEvent) => {
      marker.setAttribute(
        'style',
        mapTimeMarkerPositionToStyles(
          calculateTimeMarkerPosition({
            mousePosition,
            parentLeftOffset,
            parentWidth,
            startPosition,
          })
        )
      );
    }, 40);

    scrollRef.addEventListener('mousemove', mouseMoveHandler);
    scrollRef.addEventListener(
      'mouseup',
      ({ clientX: mousePosition }: MouseEvent) => {
        onSelectionEnd(
          mapTimeMarkerPositionToTimeRange({
            position: calculateTimeMarkerPosition({
              mousePosition,
              parentLeftOffset,
              parentWidth,
              startPosition,
            }),
            containerStartTime: startTime,
            widthPerDay: parentWidth,
          })
        );

        scrollRef.removeEventListener('mousemove', mouseMoveHandler);
        dayMarkerNode.removeChild(marker);
      },
      { once: true }
    );
  };
