import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'

import BaseComponent from 'BaseComponent'

import { selectSortedTaskAttachmentsIds } from 'models/domain/TasksModel/selectors'
import { onDeleteTaskAttachment } from 'models/domain/TasksModel/actions'

function Enhance(ComposedComponent) {
  class EnhanceCardAttachments extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      // needs
      taskId: PropTypes.string.isRequired,
      color: PropTypes.string,

      // injects
      taskAttachmentsIds: ImmutablePropTypes.list,
    }

    render() {
      return (
        <ComposedComponent
          taskAttachmentsIds={this.props.taskAttachmentsIds}
          color={this.props.color}
          style={this.props.style}
          onDeleteFile={this.props.onDeleteTaskAttachment}
          taskId={this.props.taskId}
        />
      )
    }

  }

  const mapStateToProps = (state, props) => {
    return {
      taskAttachmentsIds: selectSortedTaskAttachmentsIds(state, { taskId: props.taskId }),
    }
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onDeleteTaskAttachment: (fileId) => dispatch(onDeleteTaskAttachment(fileId, props.taskId)),
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceCardAttachments)
}

export default Enhance