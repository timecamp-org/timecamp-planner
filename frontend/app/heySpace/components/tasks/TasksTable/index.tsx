import React, { FC, useCallback } from 'react';

import { List } from 'immutable';
import { AutoSizer, Column, Table, TableCellProps, TableHeaderProps } from 'react-virtualized';

import * as colors from 'common/commonStyles/colors';
import { Dict } from 'common/types';
import { Id } from 'common/utils/identifier';
import AssigneesController from 'commonComponents/AssigneesController';
import DueDate from 'commonComponents/DueDate';
import { PropertyButton } from 'components/buttons/PropertyButton';
import SecondaryButton from 'components/buttons/SecondaryButton';
import TagList from 'components/tags/TagList';
import EmptyTaskListPlaceholder from 'components/taskList/EmptyTaskListPlaceholder';
import CardStartAndDueDateController from 'components/tasks/CardStartAndDueDateController';
import TaskSortController from 'components/tasks/taskFilters/TaskSortController';
import TaskNameOutput from 'components/tasks/taskName/TaskNameOutput/withTooltip';
import TaskProgressWithPopover from 'components/tasks/taskProgress/TaskProgressWithPopover';
import { useTranslation } from 'i18n';
import { EntityType } from 'models/domain/EntityModel/types';
import 'react-virtualized/styles.css';

import { getDueDateFormatAndLabel } from '../../../utils/getDueDateFormat';
import { CalendarDays } from '../../common/Icons/fontawesome/CalendarDays';
import CardListPicker from '../CardListPicker';
import CardSpacePicker from '../CardSpacePicker';

import styled from 'styles/styled';

import { StartAndDueDateButtonPickerInterface } from '../StartAndDueDateButtonPicker';
import { StartAndDueDateButtonPickerHookInterface } from '../StartAndDueDateButtonPicker/hook';
import TaskPrioritiesPicker from '../TaskPriority/TaskPrioritiesPicker/TaskPrioritiesPicker';

import useComponent from './hook';
import styles from './styles.css';
import { ColumnConfig, ColumnsConfig, TaskTableColumn } from './types';

const popperModifiers = {
  offset: {
    offset: `0, 20`,
  },
};

type CellRendererType = (props: TableCellProps) => JSX.Element;

const ColumnWrapper = styled.div`
  margin-left: 1.2rem;
`;

const cellRendererWrapper = (cellRenderer: CellRendererType) => (tableCellProps: TableCellProps) => (
  <ColumnWrapper>{cellRenderer(tableCellProps)}</ColumnWrapper>
);

const defaultColumnConfig: ColumnsConfig = {
  [TaskTableColumn.NAME]: {
    isVisible: true,
    isSortable: true,
    props: {
      flexGrow: 1,
      className: styles.nameRow,
      width: 250,
    },
  },
  [TaskTableColumn.ASSIGN]: {
    isVisible: true,
    isSortable: false,
    props: {
      width: 170,
    },
  },
  [TaskTableColumn.DATE]: {
    isVisible: true,
    isSortable: true,
    props: {
      width: 200,
    },
  },
  [TaskTableColumn.PROGRESS]: {
    isVisible: true,
    isSortable: true,
    props: {
      className: styles.progressRow,
      width: 90,
    },
  },
  [TaskTableColumn.SPACE]: {
    isVisible: true,
    isSortable: true,
    props: {
      width: 150,
    },
  },
  [TaskTableColumn.LIST]: {
    isVisible: true,
    isSortable: true,
    props: {
      width: 150,
    },
  },
  [TaskTableColumn.TAGS]: {
    isVisible: true,
    isSortable: false,
    props: {
      width: 200,
    },
  },
  [TaskTableColumn.PRIORITIES]: {
    isVisible: true,
    isSortable: true,
    props: {
      width: 200,
    },
  },
};

export type TasksTableInterface = {
  taskIds: List<Id>;
  filterId: Id;
  columnsConfig?: Dict<ColumnConfig>;
  className?: string;
};

const TasksTable: FC<TasksTableInterface> = (props) => {
  const { onOpenCardDetailsModal } = useComponent();

  const { t } = useTranslation();

  const columnsConfig = props.columnsConfig ? { ...defaultColumnConfig, ...props.columnsConfig } : defaultColumnConfig;
  const tasksLength = props.taskIds.size;

  const renderTaskNameCell = useCallback(
    ({ rowData: taskId }: TableCellProps) => (
      <SecondaryButton onClick={() => onOpenCardDetailsModal(taskId)} className={styles.taskNameButton}>
        <TaskNameOutput taskId={taskId} className={styles.taskName} />
      </SecondaryButton>
    ),
    [onOpenCardDetailsModal],
  );

  const renderTaskDateRangeCell = useCallback(
    ({ rowData: taskId }: TableCellProps) => (
      <CardStartAndDueDateController
        key={taskId}
        taskId={taskId}
        format={'D.MM'}
        targetRenderer={dueDateTargetRenderer}
      />
    ),
    [],
  );

  const renderHeader = useCallback(
    ({ label, disableSort, dataKey }: TableHeaderProps) => {
      if (disableSort) {
        return renderLabel(label);
      }

      return (
        <TaskSortController
          sortKey={dataKey}
          filterId={props.filterId}
          disableSort={disableSort}
          className={styles.headCell}
        >
          {renderLabel(label)}
        </TaskSortController>
      );
    },
    [props.filterId],
  );

  const renderColumn = useCallback(
    (columnKey: TaskTableColumn, name: React.ReactNode, cellRenderer: ({ rowData }: TableCellProps) => JSX.Element) => {
      const { isSortable, isVisible, props: columnProps } = columnsConfig[columnKey];
      if (!isVisible) {
        return null;
      }

      return (
        <Column
          width={columnProps.width}
          label={name}
          dataKey={columnKey}
          cellRenderer={cellRendererWrapper(cellRenderer)}
          headerRenderer={renderHeader}
          disableSort={!isSortable}
          {...columnProps}
        />
      );
    },
    [columnsConfig, renderHeader],
  );

  const makeNameLabel = ({ count }) => (
    <div className={styles.nameLabelWrapper}>
      <span className={styles.nameLabelCard}>{t('Task name')}</span>
      <span className={styles.nameLabelTaskCount}> {t('{{count}} tasks', { count })}</span>
    </div>
  );

  function getRowClassName({ index }) {
    if (index < 0) {
      return styles.headerRow;
    }
    if (index + 1 === tasksLength) {
      return styles.row;
    }
    return styles.underlinedRow;
  }

  if (props.taskIds.isEmpty()) {
    return <EmptyTaskListPlaceholder title={t('There are no tasks assigned to you')} />;
  }

  return (
    <div className={props.className || styles.innerScroll}>
      <AutoSizer>
        {({ width, height }) => (
          <Table
            height={height}
            width={width}
            headerHeight={50}
            overscanRowCount={5}
            rowHeight={50}
            rowGetter={({ index }) => props.taskIds.get(index)}
            rowCount={tasksLength}
            rowClassName={getRowClassName}
          >
            {renderColumn(TaskTableColumn.NAME, makeNameLabel({ count: props.taskIds.size }), renderTaskNameCell)}
            {renderColumn(TaskTableColumn.ASSIGN, t('Assignee'), renderTaskAssignCell)}
            {renderColumn(TaskTableColumn.SPACE, t('Project'), renderTaskSpaceCell)}
            {renderColumn(TaskTableColumn.DATE, t('Due date'), renderTaskDateRangeCell)}
            {renderColumn(TaskTableColumn.PROGRESS, t('Progress'), renderTaskProgressCell)}

            {renderColumn(TaskTableColumn.LIST, t('List'), renderTaskListCell)}
            {renderColumn(TaskTableColumn.TAGS, t('Tags'), renderTaskTagsCell)}
            {renderColumn(TaskTableColumn.PRIORITIES, t('Priority'), renderTaskPrioritiesCell)}
          </Table>
        )}
      </AutoSizer>
    </div>
  );
};

function renderLabel(label: React.ReactNode) {
  return (
    <span className={styles.columnHeader} key="label" title={typeof label === 'string' ? label : null}>
      {label}
    </span>
  );
}

function renderTaskAssignCell({ rowData: taskId }: TableCellProps) {
  return (
    <AssigneesController
      objectType={EntityType.TASK_DATA}
      objectId={taskId}
      maxAssigneesRenderCount={2}
      shouldRenderTitle={false}
      shouldClosePopoveronSelfUnassign={true}
      isEditable={true}
    />
  );
}

function renderTaskProgressCell({ rowData: taskId }: TableCellProps) {
  return (
    <TaskProgressWithPopover
      buttonClassName={styles.taskProgress}
      checkmarkClassName={styles.checkmarkWrapper}
      checkmarkColor={colors.trueGreenColor}
      hideOnEmpty={false}
      ignoreDebounce={true}
      taskId={taskId}
    />
  );
}

function renderTaskSpaceCell({ rowData: taskId }: TableCellProps) {
  return (
    <CardSpacePicker
      taskId={taskId}
      itemClassName={styles.breadcrumbItem}
      targetClassName={styles.breadcrumbButton}
      popperModifiers={popperModifiers}
    />
  );
}

function renderTaskListCell({ rowData: taskId }: TableCellProps) {
  return (
    <CardListPicker
      taskId={taskId}
      itemClassName={styles.breadcrumbItem}
      targetClassName={styles.breadcrumbButton}
      popperModifiers={popperModifiers}
    />
  );
}

function renderTaskTagsCell({ rowData: taskId }: TableCellProps) {
  return (
    <TagList
      objectId={taskId}
      isDeletable={true}
      className={styles.tagList}
      customButtonClassName={styles.tagListClassName}
      tagClassName={styles.tag}
      maxTagsToShow={2}
      showAddTagOnEmpty={true}
    />
  );
}
function renderTaskPrioritiesCell({ rowData: taskId }: TableCellProps) {
  return <TaskPrioritiesPicker taskId={taskId} hideBorder={true} />;
}

function dueDateTargetRenderer(
  { isPickerOpen, onSetIsPickerOpen }: StartAndDueDateButtonPickerHookInterface,
  { dueDate }: Omit<StartAndDueDateButtonPickerInterface, 'targetRenderer'>,
) {
  const { format, label } = getDueDateFormatAndLabel(dueDate);

  return (
    <PropertyButton
      className={styles.dueDate}
      isActive={isPickerOpen}
      onClick={() => onSetIsPickerOpen(!isPickerOpen)}
      hasProperty={!!dueDate}
      icon={!dueDate && <CalendarDays size="sm" />}
    >
      {label ? label : <DueDate format={format} dueDate={dueDate} />}
    </PropertyButton>
  );
}

export default TasksTable;
