import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'

import { selectTaskAssigneeIds } from 'models/domain/TasksModel/selectors/domain'

function Enhance(ComposedComponent) {
  class EnhanceAssigneesAvatars extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      taskId: PropTypes.string.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          maxItems={this.props.maxItems}
          spaceBetween={this.props.spaceBetween}
          userIds={this.props.assigneeIds}
          componentStyles={this.props.componentStyles}
          countRenderer={this.props.countRenderer}
          alwaysShowCounter={this.props.alwaysShowCounter}
        />
      )
    }

  }

  function mapStateToProps(state, props) {
    return {
      assigneeIds: selectTaskAssigneeIds(state, { taskId: props.taskId }),
    }
  }

  return connect(mapStateToProps)(EnhanceAssigneesAvatars)
}

export default Enhance
