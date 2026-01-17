/* eslint-disable no-case-declarations */

import { useLocalStorage } from 'common/hooks/useLocalStorage';
import TaskSortController from 'components/tasks/taskFilters/TaskSortController';
import 'react-virtualized/styles.css';
import { getConditionalClass } from 'utils/getConditionalClass';

import { getColumnsConfig } from './columns-config';
import { DraggableCollapsibleTable } from './DragableCollipsbleTable/DraggableCollipsableTable';
import { DraggableTableCell } from './DragableCollipsbleTable/DraggableTableCell';
import { DraggableTableRow } from './DragableCollipsbleTable/DraggableTableRow';
import { FirstColumnLabel } from './FirstColumnLabel';
import styles from './styles.css';
import { TaskNameCell } from './TaskNameCell';
import { ColumnConfigInterface, TasksTableInterface } from './types';

export type GroupedTasksTableInterface = TasksTableInterface & {
  columnsConfig?: ColumnConfigInterface[];
};
export const GroupedTasksTable: ReactFCWithChildren<GroupedTasksTableInterface> = ({
  taskIds,
  groupId,
  groupBy,
  children,
  filterId,
  disableCollapse,
  columnsConfig,
}) => {
  const [isOpen, setIsOpen] = useLocalStorage(`listGroup-isTableOpen-${groupId}`, true);
  const itemsTotal = taskIds.length;
  const isDragDisabled = groupBy !== 'list';

  const onClick = () => {
    if (!disableCollapse) {
      setIsOpen((open) => !open);
    }
  };

  const firstColumn = {
    width: '50%',
    key: 'name',
    minWidth: '30rem',
    isSortable: true,
    label: (
      <FirstColumnLabel
        disableCollapse={disableCollapse}
        groupBy={groupBy}
        groupId={groupId}
        isOpen={isOpen}
        itemsTotal={itemsTotal}
        onClick={onClick}
      />
    ),
    renderCell: (taskId: string) => (
      <TaskNameCell taskId={taskId} showAssignees={groupBy === 'assignees'} showHandle={!isDragDisabled} />
    ),
  };

  const config: ColumnConfigInterface[] = [firstColumn, ...(columnsConfig || getColumnsConfig(groupBy))];

  const headers = config.map(({ label, width, key, isSortable, className }) => (
    <DraggableTableCell width={width} key={key}>
      <TaskSortController
        sortKey={key}
        filterId={filterId}
        disableSort={!isSortable}
        className={`${styles.headCell} ${getConditionalClass(className, !!className)}`}
      >
        {label}
      </TaskSortController>
    </DraggableTableCell>
  ));

  return (
    <DraggableCollapsibleTable
      tableId={groupId}
      isOpen={disableCollapse || isOpen}
      headers={headers}
      rows={taskIds.map((id, index) => (
        <DraggableTableRow
          className={styles.hoverParent}
          isDragDisabled={isDragDisabled}
          draggableId={id}
          index={index}
          key={id}
          itemRenderer={(taskId) => (
            <>
              {config.map(({ renderCell, width, className, minWidth }, index) => (
                <DraggableTableCell key={`${taskId}${index}`} width={width} minWidth={minWidth}>
                  <div className={`${styles.cellContent} ${getConditionalClass(className, !!className)}`}>
                    {renderCell(taskId)}
                  </div>
                </DraggableTableCell>
              ))}
            </>
          )}
        ></DraggableTableRow>
      ))}
    >
      {children}
    </DraggableCollapsibleTable>
  );
};
