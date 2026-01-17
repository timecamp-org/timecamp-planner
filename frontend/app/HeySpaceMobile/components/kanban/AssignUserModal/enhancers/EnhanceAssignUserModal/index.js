import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'

import { onAddToTaskPeople, onRemoveFromTaskPeople } from 'models/domain/TasksModel/actions'
import { selectTaskColor } from 'models/domain/TasksModel/selectors'
import { selectTaskAssigneeIds } from 'models/domain/TasksModel/selectors/domain'
import { selectUsersSearchName } from 'models/domain/UsersModel/selectors/domain'
import { searchUserIdsByText } from 'models/component/SearchModel/utils'

import { TaskPeopleRole } from 'models/domain/TasksModel/types'

function Enhance(ComposedComponent) {
  class EnhanceAssignUserModal extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      taskId: PropTypes.string.isRequired,
    }

    state = {
      value: '',
      userIds: this.getAllUserIds(),
    }

    render() {
      return (
        <ComposedComponent
          value={this.state.value}
          isVisible={this.props.isVisible}

          taskColor={this.props.taskColor}

          userIds={this.state.userIds}
          assigneeIds={this.props.assigneeIds}

          setTextInputRef={this.setTextInputRef}
          blurTextInput={this.blurTextInput}
          onChangeText={this.onChangeText}
          onClickClose={this.props.onClickClose}
          onAssignUserToTask={this.onAssignUserToTask}
          onRemoveUserFromTask={this.props.onRemoveUserFromTask}
        />
      )
    }

    setTextInputRef(ref) {
      this.textInputRef = ref
    }

    blurTextInput() {
      if (this.textInputRef) {
        this.textInputRef.blur()
      }
    }

    getAllUserIds() {
      const userIds = this.props.usersSearchNames.keySeq().toList()
      return userIds.filter(userId => this.props.assigneeIds.indexOf(userId) === -1)
    }

    getUserIds(value) {
      const { usersSearchNames, projectPeople } = this.props
      return searchUserIdsByText(usersSearchNames, value, projectPeople)
    }

    onChangeText(value) {
      this.setState({
        value,
        userIds: value !== '' ? this.getUserIds(value) : this.getAllUserIds(),
      })
    }

    onAssignUserToTask(userId) {
      this.props.onAssignUserToTask(userId)
      this.setState({ value: '' })
    }

  }

  function mapStateToProps(state, props) {
    return {
      taskColor: selectTaskColor(state, { taskId: props.taskId }),
      usersSearchNames: selectUsersSearchName(state),
      assigneeIds: selectTaskAssigneeIds(state, { taskId: props.taskId }),
    }
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onAssignUserToTask: (userId) => dispatch(onAddToTaskPeople(props.taskId, userId, TaskPeopleRole.ASSIGNEE)),
      onRemoveUserFromTask: (userId) => dispatch(onRemoveFromTaskPeople(props.taskId, userId)),
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceAssignUserModal)
}

export default Enhance
