import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'

import { selectProjectIdByTaskId } from 'models/domain/TasksModel/selectors'
import { selectListIdByTaskId } from 'models/domain/ListsModel/selectors'


function enhance(ComposedComponent) {
  class EnhnaceCardDetailsBreadcrumbs extends BaseComponent {

    static propTypes = {
      taskId: PropTypes.string.isRequired,

      listId: PropTypes.string.isRequired,
      projectId: PropTypes.string.isRequired,
    }

    state = {
      isMoveCardModalOpened: false,
    }

    render() {
      return (
        <ComposedComponent
          taskId={this.props.taskId}
          listId={this.props.listId}
          projectId={this.props.projectId}

          isMoveCardModalOpened={this.state.isMoveCardModalOpened}
          onClickBreadcrumbs={this.onClickBreadcrumbs}
          onCloseMoveCardModal={this.onCloseMoveCardModal}
        />
      )
    }

    onClickBreadcrumbs() {
      this.setState({
        isMoveCardModalOpened: true,
      })
    }

    onCloseMoveCardModal() {
      this.setState({
        isMoveCardModalOpened: false,
      })
    }

  }

  const mapStateToProps = (state, props) => {
    const { taskId } = props
    return {
      listId: selectListIdByTaskId(state, { taskId }),
      projectId: selectProjectIdByTaskId(state, { taskId }),
    }
  }

  return connect(mapStateToProps)(EnhnaceCardDetailsBreadcrumbs)
}

export default enhance
