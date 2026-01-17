import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import generateId from 'common/utils/generate-pushid';
import EnhanceWithRouter from 'enhancers/EnhanceWithRouter';
import { List, Map } from 'immutable';
import { connect } from 'react-redux';

import EnhanceWithClickOutside from 'react-click-outside';

import { selectListColor, selectProjectIdByListId } from 'models/domain/ListsModel/selectors';
import * as TasksModelActions from 'models/domain/TasksModel/actions';
import { TaskPeopleRole, TaskCreateSource } from 'models/domain/TasksModel/types';

import BaseComponent from 'commonEnhancers/BaseComponent';
import { indexOf } from 'lodash';

const emptyList = new List();
const emptyMap = new Map();

function Enhance(ComposedComponent) {
  @EnhanceWithRouter()
  @EnhanceWithClickOutside
  class EnhanceCardInput extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
      projectId: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      sectionId: PropTypes.string,
      userId: PropTypes.string,
      shouldFocusOnMount: PropTypes.bool,
      createAtTheBeginning: PropTypes.bool,

      onTaskCreate: PropTypes.func.isRequired,
      onClickOutsideDispatched: PropTypes.func.isRequired,
      onCreateTaskDispatched: PropTypes.func.isRequired,
      onCancelDispatched: PropTypes.func.isRequired,
      onMount: PropTypes.func.isRequired,
    };

    static defaultProps = {
      shouldFocusOnMount: false,
      createAtTheBeginning: false,

      onTaskCreate: doNothing,
      onClickOutsideDispatched: doNothing,
      onCreateTaskDispatched: doNothing,
      onCancelDispatched: doNothing,
      onMount: doNothing,
    };

    state = {
      isFocused: this.props.shouldFocusOnMount,
      taskNameInputValue: '',
      assigneeIds: List(),
      isAssigneesIdsPickerOpen: false,
    };

    assigneeControllerRef = undefined;

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          color={this.props.color}
          isFocused={this.state.isFocused}
          taskNameInputValue={this.state.taskNameInputValue}
          inputRef={this.inputRef}
          onChangeTaskName={this.onChangeTaskName}
          onClick={this.onClick}
          onKeyDown={this.onKeyDown}
          onSetIsFocused={this.onSetIsFocused}
          onCancel={this.onCancel}
          assigneeIds={this.state.assigneeIds}
          onAddAssigneeId={this.onAddAssigneeId}
          onRemoveAssigneeId={this.onRemoveAssigneeId}
          onSetAssigneeControllerRef={(ref) => {
            this.assigneeControllerRef = ref;
          }}
          onSetIsAssigneesIdsPickerOpen={this.onSetIsAssigneesIdsPickerOpen}
          isAssigneesIdsPickerOpen={this.state.isAssigneesIdsPickerOpen}
        />
      );
    }

    inputRef(ref) {
      this.input = ref;
    }

    onSetIsAssigneesIdsPickerOpen(isPickerOpen) {
      this.setState({
        isAssigneesIdsPickerOpen: isPickerOpen,
      });
    }

    onAddAssigneeId(userId) {
      this.setState({
        assigneeIds: this.state.assigneeIds.push(userId),
      });
    }

    onRemoveAssigneeId(userId) {
      this.setState({
        assigneeIds: this.state.assigneeIds.delete(indexOf(this.state.assigneeIds.toArray(), userId)),
      });
    }

    onClearAssigneeIds() {
      this.setState({
        assigneeIds: List(),
      });
    }

    onChangeTaskName(event) {
      this.setState({
        taskNameInputValue: event.target.value,
      });
    }

    onKeyDown(event) {
      event.stopPropagation();
      switch (event.key) {
        case 'Enter': {
          event.preventDefault();
          const name = event.target.value;
          // don't create task with empty name
          if (name) {
            this.onTaskCreate(name, false);
          }
          this.props.onUpdate?.();
          break;
        }

        case 'Escape': {
          this.onCancel();
          break;
        }

        default:
          break;
      }
    }

    onClick() {
      this.onTaskCreate(this.state.taskNameInputValue);
    }

    onTaskCreate(name, shouldHideInput = true) {
      const { userId } = this.props;
      const taskId = generateId('task');
      let taskPeople = emptyMap;
      let taskFollowerIds = emptyList;

      if (userId) {
        taskPeople = taskPeople.set(userId, TaskPeopleRole.ASSIGNEE);
        taskFollowerIds = taskFollowerIds.push(userId);
      }

      if (this.state.assigneeIds.size) {
        this.state.assigneeIds.toArray().forEach((userId) => {
          taskPeople = taskPeople.set(userId, TaskPeopleRole.ASSIGNEE);
        });
      }

      this.props.onTaskCreate(this.props.projectId, name, taskId, this.props.userId, taskPeople, taskFollowerIds);
      this.clearTaskNameInputValue();
      if (shouldHideInput) {
        this.onSetIsFocused(false);
        this.props.onMount?.();
      }

      this.props.onCreateTaskDispatched(shouldHideInput);
      this.onClearAssigneeIds();
    }

    onCancel() {
      this.clearTaskNameInputValue();
      this.onSetIsFocused(false);
      this.props.onCancelDispatched();
    }

    clearTaskNameInputValue() {
      this.setState({
        taskNameInputValue: '',
      });
    }

    onSetIsFocused(isFocused) {
      this.setState({ isFocused });
    }

    handleClickOutside(e) {
      const leaveFocused = this.state.taskNameInputValue.length > 0 || this.assigneeControllerRef?.contains?.(e.target);

      if (leaveFocused) {
        // leave focused
      } else {
        this.onSetIsFocused(false);
        this.props.onClickOutsideDispatched();
      }
    }

    componentDidMount() {
      this.props.onMount?.();
      if (this.state.isFocused && this.props.shouldFocusOnMount) {
        setImmediate(() => {
          if (this.input) {
            this.input.focus();
          }
        });
      }
    }

    componentDidUpdate(prevProps, prevState) {
      if (!prevState.isFocused && this.state.isFocused) {
        setImmediate(() => {
          if (this.input) {
            this.input.focus();
          }
        });
      }
    }
  }

  function mapStateToProps(state, props) {
    return {
      projectId: selectProjectIdByListId(state, { listId: props.sectionId }),
      color: selectListColor(state, { listId: props.sectionId }),
    };
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onTaskCreate: (projectId, name, id, userId, taskPeople, taskFollowerIds) => {
        dispatch(
          TasksModelActions.onTaskCreate(
            {
              id,
              projectId,
              name,
              wasJustCreated: true,
            },
            null,
            false,
            !props.createAtTheBeginning,
            props.createAtTheBeginning,
            props.sectionId,
            taskPeople,
            taskFollowerIds,
            TaskCreateSource.KANBAN,
          ),
        );
      },
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceCardInput);
}

export default Enhance;
