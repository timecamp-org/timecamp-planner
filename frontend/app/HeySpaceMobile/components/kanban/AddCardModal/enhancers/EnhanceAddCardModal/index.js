import React from 'react'
import { Keyboard } from 'react-native'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { List, Map } from 'immutable'
import BaseComponent from 'BaseComponent'

import generateId from 'common/utils/generate-pushid'

import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import { selectListColor, selectProjectIdByListId } from 'models/domain/ListsModel/selectors'
import * as TasksModelActions from 'models/domain/TasksModel/actions'
import { TaskPeopleRole } from '../../../../../../common/models/domain/TasksModel/types'

const emptyMap = new Map()
const emptyList = new List()

function Enhance(ComposedComponent) {
  class EnhanceAddCardModal extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      listId: PropTypes.string.isRequired,
      createAtTheBeginning: PropTypes.bool.isRequired,
      usersToAssign: ImmutablePropTypes.listOf(PropTypes.string),
    }

    static defaultProps = {
      usersToAssign: emptyList,
    }

    state = {
      name: '',
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}

          onChangeText={this.onChangeText}
          onSubmit={this.onSubmit}
          onCancel={this.onCancel}
        />
      )
    }

    onChangeText(name) {
      this.setState({ name })
    }

    onSubmit() {
      Keyboard.dismiss()
      this.onTaskCreate(this.state.name)
    }

    onCancel() {
      this.setState({
        name: '',
      })
      Keyboard.dismiss()
      this.props.onClose()
    }

    getTaskPeople(usersToAssign) {
      if (usersToAssign.isEmpty()) {
        return emptyMap
      } else {
        return usersToAssign.reduce((taskPeople, userId) => taskPeople.set(userId, TaskPeopleRole.ASSIGNEE), emptyMap)
      }
    }

    onTaskCreate(name) {
      const { userId } = this.props
      const taskId = generateId('task')

      const taskPeople = this.getTaskPeople(this.props.usersToAssign)
      const taskFollowerIds = this.props.usersToAssign

      this.props.onTaskCreate(this.props.projectId, name, taskId, userId, taskPeople, taskFollowerIds)
      this.props.onClose()
    }

  }

  function mapStateToProps(state, props) {
    return {
      userId: selectCurrentUserId(state),
      listColor: selectListColor(state, { listId: props.listId }),
      projectId: selectProjectIdByListId(state, { listId: props.listId }),
    }
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onTaskCreate: (projectId, name, id, userId, taskPeople, taskFollowerIds) => {
        dispatch(TasksModelActions.onTaskCreate({
          id,
          projectId,
          name,
          wasJustCreated: true,
        }, null, false, !props.createAtTheBeginning, props.createAtTheBeginning, props.listId, taskPeople, taskFollowerIds))
      },
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceAddCardModal)
}

export default Enhance
