import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'

import { selectTaskColor } from 'models/domain/TasksModel/selectors'
import { selectProjectIdByTaskId } from 'models/domain/TasksModel/selectors'
import RouteName from '../../../../AppNavigation/routeNames'
import { NavigationService } from 'common/services'

function Enhance(ComposedComponent) {
  class EnhanceCard extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      taskId: PropTypes.string.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          taskId={this.props.taskId}
          taskColor={this.props.taskColor}
          onClickCard={this.onClickCard}
        />
      )
    }

    onClickCard() {
      NavigationService.navigate(RouteName.CARD_DETAILS, {
        taskId: this.props.taskId,
        projectId: this.props.projectId,
      })
    }

  }

  function mapStateToProps(state, props) {
    return {
      taskColor: selectTaskColor(state, { taskId: props.taskId }),
      projectId: selectProjectIdByTaskId(state, { taskId: props.taskId }),
    }
  }

  return connect(mapStateToProps)(EnhanceCard)
}

export default Enhance
