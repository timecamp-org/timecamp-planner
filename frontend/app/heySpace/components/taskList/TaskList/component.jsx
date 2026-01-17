import { memo, useCallback } from 'react';

import { List } from 'immutable';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { AutoSizer, CellMeasurer, List as VirtualList, WindowScroller } from 'react-virtualized';

import { doNothing } from 'common/utils';
import DraggableTaskListItem from 'components/taskList/DraggableTaskListItem';
import 'react-virtualized/styles.css';

const emptyList = new List();

TaskList.propTypes = {
  taskIds: ImmutablePropTypes.list,

  isDraggable: PropTypes.bool,
  isVirtual: PropTypes.bool,
  isUsingPlaceholder: PropTypes.bool,
  scrollContainer: PropTypes.object,
  onSetRef: PropTypes.func,
  onSetScrollerRef: PropTypes.func,
};

TaskList.defaultProps = {
  taskIds: emptyList,

  isDraggable: false,
  isVirtual: false,
  isUsingPlaceholder: false,
  onSetRef: doNothing,
  onSetScrollerRef: doNothing,
};

function TaskList(props) {
  if (props.isVirtual) {
    return renderVirtualizedList(props);
  } else {
    return renderStandardList(props);
  }
}

function renderVirtualizedList(props) {
  const renderTaskRow = useCallback(
    ({ index, key, parent, style }) => {
      const taskId = props.taskIds.get(index);

      if (!taskId) {
        return null;
      }

      return (
        <CellMeasurer
          key={`TaskListItem_${taskId}`}
          cache={props.cache}
          columnIndex={0}
          parent={parent}
          rowIndex={index}
        >
          <div style={style}>
            <DraggableTaskListItem taskId={taskId} index={index} />
          </div>
        </CellMeasurer>
      );
    },
    [props.taskIds],
  );

  if (!props.scrollContainer) {
    return null;
  }

  return (
    <WindowScroller scrollElement={props.scrollContainer}>
      {({ height, isScrolling, scrollTop, onChildScroll }) => {
        return (
          <AutoSizer disableHeight>
            {({ width }) => (
              <VirtualList
                autoHeight={true}
                height={height || 0}
                width={width}
                scrollTop={scrollTop}
                isScrolling={isScrolling}
                rowCount={getRowCount(props)}
                rowHeight={props.cache.rowHeight}
                rowRenderer={renderTaskRow}
                deferredMeasurementCache={props.cache}
                overscanRowCount={3}
                ref={props.onSetRef}
                onScroll={onChildScroll}
              />
            )}
          </AutoSizer>
        );
      }}
    </WindowScroller>
  );
}

function getRowCount(props) {
  return props.isUsingPlaceholder ? props.taskIds.size + 1 : props.taskIds.size;
}

function renderStandardList(props) {
  return props.taskIds.map(renderTask);
}

function renderTask(taskId, index) {
  return <DraggableTaskListItem key={`TaskListItem_${taskId}`} taskId={taskId} index={index} />;
}

export default memo(TaskList);
