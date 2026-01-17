import { throttle } from 'lodash';

import {
  GROUP_ROW_ID_PREFIX_CLASS_NAME,
  groupRowClassName,
  HEADER_WRAPPER_CLASS_NAME,
  SCROLL_CLASS_NAME,
} from './constants';
import {
  calculateTimeMarkerPosition,
  calculateTimeMarkerPositionToTimeRange,
  extractPrefixedValue,
  mapTimeMarkerPositionToStyles,
} from './helpers';
import styles from './styles.css';

export const timeSelectionExtension = ({
  visibleStartDate,
  visibleEndDate,
  onSelectionEnd,
}: {
  visibleStartDate: number;
  visibleEndDate: number;
  onSelectionEnd: (props: { groupId: string; timeStart: number; timeEnd: number }) => void;
}) => {
  const mouseDownHandler = ({ clientX: mouseStartClientX, target: groupRef }: MouseEvent) => {
    const scrollRef = document.querySelector(`.${SCROLL_CLASS_NAME}`);
    const headerRef = document.querySelector(`.${HEADER_WRAPPER_CLASS_NAME}`);

    const { x: offsetX, y: offsetY, width: headerWidth, height: containerHeight } = headerRef.getBoundingClientRect();
    const { width: screenWidth } = document.querySelector('body').getBoundingClientRect();

    const marker = document.createElement('div');
    marker.classList.add(styles.newItemIndicator);

    headerRef.appendChild(marker);

    const mouseMoveHandler = throttle(({ clientX: mouseStopClientX }: MouseEvent) => {
      marker.setAttribute(
        'style',
        mapTimeMarkerPositionToStyles(
          calculateTimeMarkerPosition({
            mouseStartClientX,
            mouseStopClientX,
            offsetX,
            screenWidth,
            containerHeight,
            offsetY,
          })
        )
      );
    }, 40);

    scrollRef.addEventListener('mousemove', mouseMoveHandler);
    scrollRef.addEventListener(
      'mouseup',
      ({ clientX: mouseStopClientX }: MouseEvent) => {
        const groupId = extractPrefixedValue(
          (groupRef as HTMLDivElement).getAttribute('class'),
          GROUP_ROW_ID_PREFIX_CLASS_NAME
        );

        onSelectionEnd({
          groupId,
          ...calculateTimeMarkerPositionToTimeRange({
            position: calculateTimeMarkerPosition({
              mouseStartClientX,
              mouseStopClientX,
              offsetX,
              screenWidth,
              containerHeight,
              offsetY,
            }),
            containerStartTime: visibleStartDate,
            containerEndTime: visibleEndDate,
            headerLeftOffset: offsetX,
            screenWidth,
            headerWidth,
          }),
        });

        scrollRef.removeEventListener('mousemove', mouseMoveHandler);
        headerRef.removeChild(marker);
      },
      { once: true }
    );
  };

  const groups = document.querySelectorAll<HTMLDivElement>(`.${groupRowClassName}`);

  groups.forEach((group) => {
    group.onmousedown = mouseDownHandler;
  });
};
