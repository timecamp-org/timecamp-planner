/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { useRef } from 'react';

import { ItemContext, ReactCalendarItemRendererProps } from 'react-calendar-timeline';

import cssStyles from '../styles.css';
import { ItemRenderer, TimelineItemData } from '../types';

import 'react-calendar-timeline/lib/Timeline.css';
import { getConditionalClass } from 'utils/getConditionalClass';
// eslint-disable-next-line @typescript-eslint/ban-types
interface TimelineItemInterface extends ReactCalendarItemRendererProps<TimelineItemData<{}>> {
  hasTimeMarkers: boolean;
  hasGroups: boolean;
  scrollRef: HTMLElement;
  leftClassName?: string;
  rightClassName?: string;
  itemRenderer: ItemRenderer;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const TimelineItem = ({
  itemRenderer,
  getResizeProps,
  itemContext,
  item,
  scrollRef,
  leftClassName,
  rightClassName,
  hasTimeMarkers,
  hasGroups,
  ...props
}: TimelineItemInterface) => {
  const wrapperRef = useRef();
  const { selected: isSelected } = itemContext;

  const selectedProps = {
    leftClassName,
    rightClassName,
  };
  const { left: leftResizeProps, right: rightResizeProps } = getResizeProps(isSelected ? selectedProps : undefined);
  const isResizeHandleVisible = (item?.isEditable ?? true) && shouldRenderResizeHandle(itemContext);

  const isTimeMarker = !item?.taskId && hasTimeMarkers;

  return (
    <div ref={wrapperRef}>
      <div
        {...(props.getItemProps(item.itemProps) as any)}
        className={`${cssStyles.item}  
        ${getConditionalClass(cssStyles.timeMarkerOffset, isTimeMarker)}        
        ${getConditionalClass(cssStyles.plannerItemOffset, hasTimeMarkers && !isTimeMarker)} 
       `}
      >
        {isResizeHandleVisible ? <div {...(leftResizeProps as any)} /> : ''}
        {itemRenderer({
          item,
          isSelected,
          isResizeHandleVisible,
          width: itemContext.dimensions.width,
          wrapperRef: wrapperRef.current,
          scrollRef,
        })}
        {isResizeHandleVisible ? <div {...(rightResizeProps as any)} /> : ''}
      </div>
    </div>
  );
};

const MIN_RESIZABLE_WIDTH = 20;
function shouldRenderResizeHandle(itemContext: ItemContext) {
  const { dimensions, useResizeHandle } = itemContext;

  return useResizeHandle && dimensions.width > MIN_RESIZABLE_WIDTH;
}
