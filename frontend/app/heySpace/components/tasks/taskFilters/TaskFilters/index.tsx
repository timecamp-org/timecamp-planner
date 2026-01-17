import { FC } from 'react';

import { doNothing } from 'common/utils';
import { Id } from 'common/utils/identifier';
import Checkbox from 'commonComponents/Checkbox';
import { X as XIcon } from 'commonComponents/Icons';
import RadioButton from 'commonComponents/RadioButton';
import { UserGroup } from 'commonComponents/UserGroup/UserGroup';
import SecondaryButton from 'components/buttons/SecondaryButton';
import ProjectName from 'components/projects/projectName/ProjectName';
import { useTranslation } from 'i18n';
import { TranslateFunction } from 'i18n/types';
import { TaskFiltersContainerType, TaskFiltersTargetType } from 'models/component/FiltersModel/types';
import { TaskDueDateFilterInterface } from 'models/domain/TasksModel/constants/tasksFilters';

import PersonFullName from '../../../person/PersonFullName';
import Tag from '../../../tags/Tag';
import TaskFiltersResultsCount from '../TaskFiltersResultsCount';
import TaskFiltersSection from '../TaskFiltersSection';

import useComponent, { TaskFiltersHookInterface } from './hooks';
import styles from './styles.css';

export type TaskFiltersInterface = {
  containerType: TaskFiltersContainerType;
  targetType: TaskFiltersTargetType;
  containerId: Id;
  filterId?: Id;
  className?: string;
  shouldRenderCloseIcon?: boolean;
  isDueDatesEnabled?: boolean;
  isProjectsSectionVisible?: boolean;
  isUserGroupVisible?: boolean;
  isArchivedStatusVisible?: boolean;
  onCloseFilters?: VoidFunction;
  labelRenderer?: () => JSX.Element;
};

const defaultProps = {
  isDueDatesEnabled: false,
  isProjectsSectionVisible: false,
  shouldRenderCloseButton: false,

  onCloseFilters: doNothing,
};

const TaskFilters: FC<TaskFiltersInterface> = (props) => {
  const { t } = useTranslation();
  const hook = useComponent(props);
  const isDueDatesSectionVisible = hook.taskDueDateOptions.size > 0 && props.isDueDatesEnabled;

  return (
    <div className={props.className || styles.Component}>
      {props.shouldRenderCloseIcon && renderCloseButton(hook, props)}
      {renderHeader(hook, props, t)}
      <div className={styles.filtersContainer}>
        {hook.taskStatusOptions.size > 0 && renderStatusSection()}
        {isDueDatesSectionVisible && renderDueDateSection()}
        {props.isProjectsSectionVisible && renderTaskProjectsSection()}
        {!hook.tasksAssignees.isEmpty() && renderTaskAssigneeSection()}
        {!hook.tasksTagIds.isEmpty() && renderTaskTagsSection()}
        {props.isUserGroupVisible && renderUsersGroupsOption()}
      </div>
    </div>
  );

  function renderStatusSection() {
    return (
      <TaskFiltersSection className={styles.statusSection} header={t('Status')}>
        <form>
          {hook.taskStatusOptions.map((status) => (
            <SecondaryButton
              key={status.key}
              className={styles.field}
              onClick={() => hook.onSelectStatusFilter(status.key)}
              color={hook.color}
            >
              <RadioButton
                label={t(status.label)}
                className={styles.radioOption}
                isChecked={hook.taskStatusFilter === status.key}
                color={hook.color}
              />
              <TaskFiltersResultsCount
                containerType={props.containerType}
                targetType={props.targetType}
                containerId={props.containerId}
                filterId={hook.filterId}
                filterPath={['status', status.key]}
              />
            </SecondaryButton>
          ))}
        </form>
      </TaskFiltersSection>
    );
  }

  function renderDueDateSection() {
    return (
      <TaskFiltersSection
        header={t('Due date')}
        isExpanded={hook.isDueDatesExpanded}
        hiddenCount={hook.taskDueDatesHiddenCount}
        onSetIsExpanded={hook.onSetIsDueDatesExpanded}
      >
        {hook.taskDueDateOptions.map(renderTaskDueDateOption)}
      </TaskFiltersSection>
    );
  }

  function renderTaskDueDateOption(dueDateOption: TaskDueDateFilterInterface) {
    const isChecked = hook.taskDueDateFilter.contains(dueDateOption.key);

    return (
      <div
        key={dueDateOption.key}
        className={styles.option}
        onClick={(event) => {
          hook.onCheckDueDate(dueDateOption.key, isChecked);
          if (event.preventDefault) {
            event.preventDefault();
          }
        }}
      >
        <Checkbox className={styles.checkbox} isChecked={isChecked} color={hook.color} />
        <span>{t(dueDateOption.label)}</span>
        <TaskFiltersResultsCount
          containerType={props.containerType}
          targetType={props.targetType}
          containerId={props.containerId}
          filterId={hook.filterId}
          filterPath={['dueDate', dueDateOption.key]}
        />
      </div>
    );
  }

  function renderTaskAssigneeSection() {
    return (
      <TaskFiltersSection
        header={t('Assignee')}
        isExpanded={hook.isAssigneesExpanded}
        hiddenCount={hook.tasksAssigneesHiddenCount}
        onSetIsExpanded={hook.onSetIsAssigneesExpanded}
      >
        {hook.tasksAssignees.map(renderTaskAssigneeOption)}
      </TaskFiltersSection>
    );
  }

  function renderTaskTagsSection() {
    return (
      <TaskFiltersSection
        header={t('Tag')}
        isExpanded={hook.isTagsExpanded}
        hiddenCount={hook.tasksTagIdsHiddenCount}
        onSetIsExpanded={hook.onSetIsTagsExpanded}
      >
        {hook.tasksTagIds.map(renderTagOption)}
      </TaskFiltersSection>
    );
  }

  function renderTaskProjectsSection() {
    return (
      <TaskFiltersSection
        header={t('Project')}
        isExpanded={hook.isProjectsExpanded}
        hiddenCount={hook.hiddenTasksProjectIdsCount}
        onSetIsExpanded={hook.onSetIsProjectsExpanded}
      >
        {hook.tasksProjectIds.map(renderProjectOption)}
      </TaskFiltersSection>
    );
  }

  function renderTaskAssigneeOption(userId: Id) {
    const isChecked = hook.taskAssigneeFilter.contains(userId);

    return (
      <div
        key={userId}
        className={styles.option}
        onClick={(event) => {
          hook.onCheckAssignee(userId, isChecked);
          if (event.preventDefault) {
            event.preventDefault();
          }
        }}
      >
        <Checkbox className={styles.checkbox} isChecked={isChecked} color={hook.color} />
        {userId === 'none' ? (
          <div>{t('Unassigned')}</div>
        ) : (
          <PersonFullName userId={userId} className={styles.userLabel} />
        )}
        <TaskFiltersResultsCount
          containerType={props.containerType}
          targetType={props.targetType}
          containerId={props.containerId}
          filterId={hook.filterId}
          filterPath={['assigneeId', userId]}
        />
      </div>
    );
  }

  function renderUserGroupOption(userGroupId: Id) {
    const isChecked = hook.taskAssigneeGroupFilter.contains(userGroupId);

    return (
      <div
        key={userGroupId}
        className={styles.option}
        onClick={(event) => {
          hook.onCheckUserGroup(userGroupId, isChecked);
          if (event.preventDefault) {
            event.preventDefault();
          }
        }}
      >
        <Checkbox className={styles.checkbox} isChecked={isChecked} color={hook.color} />
        {userGroupId === 'none' ? (
          <div>{t('No defined job titles')}</div>
        ) : (
          <UserGroup userGroupId={userGroupId} className={styles.userLabel} />
        )}
        <TaskFiltersResultsCount
          containerType={props.containerType}
          targetType={props.targetType}
          containerId={props.containerId}
          filterId={hook.filterId}
          filterPath={['userGroup', userGroupId]}
        />
      </div>
    );
  }

  function renderTagOption(tagId: Id) {
    const isChecked = hook.taskTagsFilter.contains(tagId);

    return (
      <div
        key={tagId}
        className={styles.option}
        onClick={(event) => {
          hook.onCheckTag(tagId, isChecked);
          if (event.preventDefault) {
            event.preventDefault();
          }
        }}
      >
        <Checkbox className={styles.checkbox} isChecked={isChecked} color={hook.color} />
        {tagId === 'none' ? (
          <div>{t('No tags')}</div>
        ) : (
          <Tag tagId={tagId} className={styles.tag} isDeletable={false} />
        )}
        <TaskFiltersResultsCount
          containerType={props.containerType}
          targetType={props.targetType}
          containerId={props.containerId}
          filterId={hook.filterId}
          filterPath={['tags', tagId]}
        />
      </div>
    );
  }

  function renderProjectOption(projectId: Id) {
    const isChecked = hook.taskProjectsFilter.contains(projectId);

    return (
      <div
        key={projectId}
        className={styles.option}
        onClick={(event) => {
          hook.onCheckProject(projectId, isChecked);
          if (event.preventDefault) {
            event.preventDefault();
          }
        }}
      >
        <Checkbox className={styles.checkbox} isChecked={isChecked} color={hook.color} />
        <ProjectName projectId={projectId} />
        <TaskFiltersResultsCount
          containerType={props.containerType}
          targetType={props.targetType}
          containerId={props.containerId}
          filterId={hook.filterId}
          filterPath={['projects', projectId]}
        />
      </div>
    );
  }

  function renderUsersGroupsOption() {
    return (
      <TaskFiltersSection
        header={t('Job title')}
        isExpanded={hook.isTasksAssigneeGroupExpanded}
        hiddenCount={hook.hiddenTasksAssigneeGroupsCount}
        onSetIsExpanded={hook.onSetIsTasksAssigneeGroupsExpanded}
      >
        {hook?.tasksAssigneeGroups?.map(renderUserGroupOption)}
      </TaskFiltersSection>
    );
  }
};

function renderHeader(hook: TaskFiltersHookInterface, props: TaskFiltersInterface, t: TranslateFunction) {
  return (
    <div className={styles.header}>
      {props.labelRenderer && props.labelRenderer()}
      {hook.isClearFiltersVisible && (
        <SecondaryButton onClick={hook.onClearFilters} color={hook.color} className={styles.clearFiltersLink}>
          {t('Clear filters')}
        </SecondaryButton>
      )}
    </div>
  );
}

function renderCloseButton(hook: TaskFiltersHookInterface, props: TaskFiltersInterface) {
  return (
    <SecondaryButton className={styles.closeIcon} color={hook.color} onClick={props.onCloseFilters}>
      <XIcon width={10} />
    </SecondaryButton>
  );
}

TaskFilters.defaultProps = defaultProps;

export default TaskFilters;
