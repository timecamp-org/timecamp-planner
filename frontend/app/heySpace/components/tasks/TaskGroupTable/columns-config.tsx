import AssigneesController from 'commonComponents/AssigneesController';
import { Tags } from 'commonComponents/Icons/fontawesome/Tags';
import { PropertyButton } from 'components/buttons/PropertyButton';
import TagList from 'components/tags/TagList';
import { i18mark } from 'i18n';
import { EntityType } from 'models/domain/EntityModel/types';
import { getConditionalClass } from 'utils/getConditionalClass';

import CardListPicker from '../CardListPicker';
import CardSpacePicker from '../CardSpacePicker';
import CardStartAndDueDateController from '../CardStartAndDueDateController';
import TaskPrioritiesPicker from '../TaskPriority/TaskPrioritiesPicker';
import TaskPriorityFlag from '../TaskPriority/TaskPriorityFlag';
import TaskProgressWithPopover from '../taskProgress/TaskProgressWithPopover';

import { dueDateTargetRenderer } from './dueDateTargetRenderer';
import styles from './styles.css';
import { ColumnConfigInterface } from './types';
import { TaskGroupBy } from './useTaskGroups';

const popperModifiers = {
  offset: {
    offset: '0, 15px',
  },
  preventOverflow: {
    boundariesElement: 'window',
  },
};

export const ASSIGNEE_COLUMN_CONFIG: ColumnConfigInterface = {
  key: 'assignee',
  label: i18mark('ASSIGNEE'),
  width: '10%',
  minWidth: '10rem',
  isSortable: false,
  renderCell: (taskId) => (
    <AssigneesController
      closedPopperNoAssigneesClass={styles.hoverChild}
      personIconClass={styles.personIcon}
      objectType={EntityType.TASK_DATA}
      objectId={taskId}
      maxAssigneesRenderCount={2}
      isEditable
      shouldClosePopoveronSelfUnassign
      shouldRenderTitle={false}
      variant="hideButtonOnAssigned"
    />
  ),
};

export const DUE_DATE_COLUMN_CONFIG: ColumnConfigInterface = {
  key: 'date',
  label: i18mark('DUE DATE'),
  width: '10%',
  minWidth: '9rem',
  isSortable: true,
  renderCell: (taskId) => (
    <CardStartAndDueDateController
      key={taskId}
      taskId={taskId}
      format={'D.MM'}
      targetRenderer={dueDateTargetRenderer}
    />
  ),
};

export const PROGRESS_COLUMN_CONFIG: ColumnConfigInterface = {
  key: 'progress',
  label: i18mark('PROGRESS'),
  width: '10%',
  minWidth: '9rem',
  isSortable: true,
  className: styles.center,
  renderCell: (taskId) => (
    <TaskProgressWithPopover
      taskId={taskId}
      buttonClassName={styles.taskProgress}
      ignoreDebounce
      hideOnEmpty={false}
      checkmarkClassName={styles.checkmarkWrapper}
      closedPopperNoProgressTargetClassName={styles.hoverChild}
    />
  ),
};

export const LIST_COLUMN_CONFIG: ColumnConfigInterface = {
  key: 'list',
  label: <span className={styles.listHeader}>{i18mark('LIST')}</span>,
  width: '10%',
  minWidth: '5rem',
  isSortable: true,
  renderCell: (taskId) => (
    <div>
      <CardListPicker
        taskId={taskId}
        itemClassName={styles.breadcrumbItem}
        targetClassName={styles.breadcrumbButton}
        popperModifiers={popperModifiers}
        nameLengthDisplayLimit={15}
      />
    </div>
  ),
};

export const TAGS_COLUMN_CONFIG: ColumnConfigInterface = {
  key: 'tags',
  label: i18mark('TAGS'),
  width: '10%',
  minWidth: '12rem',
  isSortable: false,
  renderCell: (taskId) => (
    <TagList
      isDeletable
      showAddTagOnBelowMaxLimit
      showAddTagOnEmpty
      maxTagsToShow={1}
      tagMaxLength={8}
      objectId={taskId}
      className={styles.tagList}
      customButtonClassName={styles.tagListClassName}
      tagClassName={styles.tag}
      addTagButtonRenderer={({ isOpen, onOpen }) => (
        <PropertyButton
          isActive={isOpen}
          onClick={onOpen}
          className={`${styles.addTagButton} ${getConditionalClass(styles.hoverChild, !isOpen)} ${
            styles.propertyButtonSize
          }`}
          icon={<Tags size="xs" className={styles.icon} />}
        />
      )}
    />
  ),
};

export const PROJECT_COLUMN_CONFIG: ColumnConfigInterface = {
  key: 'project',
  label: i18mark('PROJECT'),
  width: '6%',
  minWidth: '8.5rem',
  isSortable: true,
  renderCell: (taskId) => (
    <div>
      <CardSpacePicker
        taskId={taskId}
        itemClassName={styles.breadcrumbItem}
        targetClassName={styles.breadcrumbButton}
        popperModifiers={popperModifiers}
        nameLengthLimit={18}
      />
    </div>
  ),
};

export const PRIORITY_COLUMN_CONFIG: ColumnConfigInterface = {
  key: 'priority',
  label: i18mark('PRIORITY'),
  width: '6%',
  minWidth: '8.5rem',
  isSortable: true,
  className: styles.center,
  renderCell: (taskId) => (
    <TaskPrioritiesPicker
      taskId={taskId}
      hideBorder
      targetRenderer={({ isPopoverOpened, onClick, priorityType }) => (
        <TaskPriorityFlag
          size="xs"
          priorityType={priorityType}
          onClick={onClick}
          hideBorder={!!priorityType}
          className={`${getConditionalClass(styles.hoverChild, !priorityType && !isPopoverOpened)} ${
            styles.propertyButtonSize
          }`}
        />
      )}
    />
  ),
};

export const BASE_COLUMNS_CONFIG: ColumnConfigInterface[] = [
  ASSIGNEE_COLUMN_CONFIG,
  DUE_DATE_COLUMN_CONFIG,
  PROGRESS_COLUMN_CONFIG,
  LIST_COLUMN_CONFIG,
  TAGS_COLUMN_CONFIG,
  PRIORITY_COLUMN_CONFIG,
];

export const GROUPED_BY_LIST_CONFIG = BASE_COLUMNS_CONFIG.filter(({ key }) => key !== 'list');
export const GROUPED_BY_ASSIGNEE_CONFIG = BASE_COLUMNS_CONFIG.filter(({ key }) => key !== 'assignee');

export const getColumnsConfig = (groupBy: TaskGroupBy) => {
  switch (groupBy) {
    case 'assignees':
      return GROUPED_BY_ASSIGNEE_CONFIG;

    case 'list':
      return GROUPED_BY_LIST_CONFIG;

    default:
      return BASE_COLUMNS_CONFIG;
  }
};
