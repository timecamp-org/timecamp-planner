import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { is } from 'immutable';
import { searchUserIdsByText } from 'models/component/SearchModel/utils';

import BaseComponent from 'BaseComponent';
import { selectDeactivatedUserIds } from 'models/domain/OrganizationsModel/selectors/domain';
import { selectUsersSearchName } from 'models/domain/UsersModel/selectors/domain';
import { selectTaskAssigneeIds } from 'models/domain/TasksModel/selectors/domain';
import { onAddToTaskPeople } from 'models/domain/TasksModel/actions';
import { TaskPeopleRole } from 'models/domain/TasksModel/types';
import { withMappedNavigationParams } from 'react-navigation-props-mapper';

function enhance(ComposedComponent) {
  class EnhanceTaskAssigneesAddMemberScreen extends BaseComponent {
    static propTypes = {
      taskId: PropTypes.string.isRequired,
      deactivatedUserIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
      taskAssigneeIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
      usersSearchNames: ImmutablePropTypes.mapOf(PropTypes.string, PropTypes.string).isRequired,

      onAddToTaskPeople: PropTypes.func.isRequired,
    };

    state = {
      inputValue: '',
      userIds: this.getAllUserIds(),
    };

    render() {
      return (
        <ComposedComponent
          inputValue={this.state.inputValue}
          userIds={this.state.userIds}
          emptyUserListMessage={'No users to assign to task'}
          onChangeText={this.onChangeText}
          onItemPress={this.props.onAddToTaskPeople}
        />
      );
    }

    getAllUserIds() {
      const userIds = this.props.usersSearchNames.keySeq().toList();
      return userIds.filterNot((userId) => this.props.taskAssigneeIds.includes(userId));
    }

    getUserIds(value) {
      const { usersSearchNames, taskAssigneeIds, deactivatedUserIds } = this.props;
      return searchUserIdsByText(usersSearchNames, value, taskAssigneeIds.concat(deactivatedUserIds));
    }

    onChangeText(inputValue) {
      this.setState({
        inputValue,
        userIds: inputValue !== '' ? this.getUserIds(inputValue) : this.getAllUserIds(),
      });
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
      if (!is(prevProps.taskAssigneeIds, this.props.taskAssigneeIds)) {
        this.setState((currentState) => ({
          userIds: currentState.inputValue !== '' ? this.getUserIds(currentState.inputValue) : this.getAllUserIds(),
        }));
      }
    }
  }

  const mapStateToProps = (state, props) => ({
    usersSearchNames: selectUsersSearchName(state),
    taskAssigneeIds: selectTaskAssigneeIds(state, { taskId: props.taskId }),
    deactivatedUserIds: selectDeactivatedUserIds(state),
  });

  const mapDispatchToProps = (dispatch, props) => ({
    onAddToTaskPeople: (userId) => dispatch(onAddToTaskPeople(props.taskId, userId, TaskPeopleRole.ASSIGNEE)),
  });

  return withMappedNavigationParams()(
    connect(mapStateToProps, mapDispatchToProps)(EnhanceTaskAssigneesAddMemberScreen)
  );
}

export default enhance;
