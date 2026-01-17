import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import handleError from 'common/utils/handleError'
import * as TasksActions from 'models/domain/TasksModel/actions'
import { selectTaskColor } from 'models/domain/TasksModel/selectors'

function enhance(ComposedComponent) {
  class EnhanceCardDetailsAttachments extends BaseComponent {

    static propTypes = {
      taskId: PropTypes.string.isRequired,
      onAddFilesToTaskAttachments: PropTypes.func.isRequired,
      taskColor: PropTypes.string,
    }

    render() {
      return (
        <ComposedComponent
          taskId={this.props.taskId}
          taskColor={this.props.taskColor}
          
          onUploadFiles={this.onUploadFiles}
        />
      )
    }

    onUploadFiles(files) {
      if (files) {
        this.props.onAddFilesToTaskAttachments(files)
      } else {
        console.log('no files')
        handleError(new Error('Error selecting file'))
      }
    }

  }

  const mapStateToProps = (state, props) => {
    return {
      taskColor: selectTaskColor(state, { taskId: props.taskId }),
    }
  }

  const mapDispatchToProps = (dispatch, props) => ({
    onAddFilesToTaskAttachments: (files) => dispatch(TasksActions.onAddFilesToTaskAttachments(files, props.taskId)),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceCardDetailsAttachments)
}

export default enhance
