import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import { AlignLeft, Plus, Search } from 'commonComponents/Icons';
import SecondaryButton from 'components/buttons/SecondaryButton';
import RightPanelLabel from 'components/chat/rightPanelChat/RightPanelLabel';
import SectionList from 'components/taskList/SectionList';
import MyTaskList from 'components/taskList/SectionList/myTasks';
import TaskSectionInput from 'components/taskList/TaskSectionInput';
import TaskSearch from 'components/tasks/taskFilters/TaskSearch';
import TaskStatusFilter from 'components/tasks/taskFilters/TaskStatusFilter';
import { i18n } from 'i18n';

import { CARD_LIST } from '../utils/panelNames';

import styles from './styles.css';

TaskListRightPanelChat.propTypes = {
  projectId: PropTypes.string.isRequired,
  isTaskSearchFocused: PropTypes.bool,
  isSectionInputFocused: PropTypes.bool,
  isKanban: PropTypes.bool,
  filterId: PropTypes.string.isRequired,

  onSectionCreate: PropTypes.func,
  onSetTaskListRef: PropTypes.func,
  onSetKanbanRef: PropTypes.func,
  onScrollTaskListToBottom: PropTypes.func,
  onSetIsTaskSearchFocused: PropTypes.func,
  onSetIsSectionInputFocused: PropTypes.func,
  onMouseDown: PropTypes.func,

  isConversation: PropTypes.bool,
  shouldRenderFirstSectionInput: PropTypes.bool,
  onSetShouldRenderFirstSectionInput: PropTypes.func,
};

TaskListRightPanelChat.defaultProps = {
  isTaskSearchFocused: false,
  isSectionInputFocused: false,
  isKanban: false,

  onSectionCreate: doNothing,
  onSetTaskListRef: doNothing,
  onSetKanbanRef: doNothing,
  onScrollTaskListToBottom: doNothing,
  onSetIsTaskSearchFocused: doNothing,
  onSetIsSectionInputFocused: doNothing,
  onMouseDown: doNothing,

  shouldRenderFirstSectionInput: false,
  onSetShouldRenderFirstSectionInput: doNothing,
};

function TaskListRightPanelChat(props) {
  return (
    <div className={props.isKanban ? styles.KanbanComponent : styles.Component}>
      {props.isKanban ? null : renderHeader()}
      <div className={props.isKanban ? styles.kanbanWrapper : styles.taskList} ref={props.onSetTaskListWrapperRef}>
        {props.isConversation ? (
          <MyTaskList
            projectId={props.projectId}
            onScrollTaskListToBottom={props.onScrollTaskListToBottom}
            taskListRef={props.onSetTaskListRef}
          />
        ) : (
          <SectionList
            className={props.isKanban ? styles.kanban : undefined}
            sectionClassName={props.isKanban ? styles.section : undefined}
            projectId={props.projectId}
            isKanban={props.isKanban}
            isVirtual={props.isKanban}
            shouldRenderAddSectionButton={true}
            shouldRenderFirstSectionInput={props.shouldRenderFirstSectionInput}
            onSetShouldRenderFirstSectionInput={props.onSetShouldRenderFirstSectionInput}
            taskListRef={props.onSetTaskListRef}
            innerRef={props.onSetKanbanRef}
            onMouseDown={props.onMouseDown}
            onScrollTaskListToBottom={props.onScrollTaskListToBottom}
          />
        )}
      </div>
    </div>
  );

  function renderHeader() {
    return (
      <div className={styles.header}>
        {props.isTaskSearchFocused ? null : (
          <div className={styles.leftActions}>
            {props.isConversation ? null : <RightPanelLabel objectId={props.projectId} currentPanelName={CARD_LIST} />}
            {props.isConversation ? (
              <span className={styles.headerText}>
                <AlignLeft className={styles.listIcon} />
                {i18n.t(CARD_LIST)}
              </span>
            ) : null}
          </div>
        )}
        <div className={`${styles.rightActions} ${props.isTaskSearchFocused ? styles.fullWidth : undefined}`}>
          {!props.isTaskSearchFocused ? renderFiltersButton() : null}
          {!props.isTaskSearchFocused ? (
            <div className={styles.addButton}>
              {props.isSectionInputFocused ? (
                <TaskSectionInput
                  className={styles.taskSectionInput}
                  projectId={props.objectId}
                  isFocused={props.isSectionInputFocused}
                  createSectionAtTheBeginning={true}
                  onSetIsFocused={props.onSetIsSectionInputFocused}
                  onScrollTaskListToBottom={props.onScrollTaskListToBottom}
                />
              ) : !props.isConversation ? (
                renderAddButton()
              ) : null}
            </div>
          ) : null}
          <div className={`${styles.searchButton} ${props.isTaskSearchFocused ? styles.fullWidth : undefined}`}>
            {props.isTaskSearchFocused ? (
              <TaskSearch
                className={styles.taskSearch}
                innerClassName={styles.taskSearchInput}
                taskNameInputClass={styles.taskNameSearchInput}
                projectId={props.projectId}
                filterId={props.filterId}
                isFocused={props.isTaskSearchFocused}
                onSetIsFocused={props.onSetIsTaskSearchFocused}
              />
            ) : (
              renderSearchButton()
            )}
          </div>
        </div>
      </div>
    );
  }

  function renderFiltersButton() {
    return <TaskStatusFilter projectId={props.projectId} />;
  }

  function renderAddButton() {
    return (
      <div onClick={() => props.onSetShouldRenderFirstSectionInput(true)}>
        <SecondaryButton className={styles.icon} color={props.color}>
          <Plus />
        </SecondaryButton>
      </div>
    );
  }

  function renderSearchButton() {
    return (
      <div onClick={() => props.onSetIsTaskSearchFocused(true)}>
        <SecondaryButton className={styles.icon} color={props.color}>
          <Search />
        </SecondaryButton>
      </div>
    );
  }
}

export default TaskListRightPanelChat;
