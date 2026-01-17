import { TimelineItemBase } from 'react-calendar-timeline';

import { Id } from 'common/utils/identifier';

export type ResizeEdgeType = 'left' | 'right';

export type TimelineItemData<T> = TimelineItemBase<number> &
  T & {
    isEditable?: boolean;
    taskId?: Id;
  };

// eslint-disable-next-line @typescript-eslint/ban-types
export type ItemRenderer<T extends Object | void = {}> = (props: {
  item: TimelineItemData<T>;
  isSelected: boolean;
  isResizeHandleVisible: boolean;
  width: number;
  scrollRef: HTMLElement;
  wrapperRef: HTMLDivElement;
}) => JSX.Element;
