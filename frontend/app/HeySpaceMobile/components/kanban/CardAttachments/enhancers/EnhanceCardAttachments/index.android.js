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

    state = {
      isAttachmentOptionsModalOpen: false,
      attachmentOptionsModalParams: { attachmentId: null },
      isDeleteConfirmationModalOpen: false,
      deleteConfirmationModalParams: { attachmentId: null },
    }

    render() {
      return (
        <ComposedComponent
          taskAttachmentsIds={this.props.taskAttachmentsIds}
          color={this.props.color}
          style={this.props.style}
          onDeleteFile={this.onDeleteFile}
          taskId={this.props.taskId}

          isDeleteConfirmationModalOpen={this.state.isDeleteConfirmationModalOpen}
          isAttachmentOptionsModalOpen={this.state.isAttachmentOptionsModalOpen}

          attachmentOptionsModalParams={this.state.attachmentOptionsModalParams}
          deleteConfirmationModalParams={this.state.deleteConfirmationModalParams}

          onOpenDeleteConfirmationModal={this.onOpenDeleteConfirmationModal}
          onHideDeleteConfirmationModal={this.onHideDeleteConfirmationModal}

          onAttachmentLongPress={this.onAttachmentLongPress}
          onAttachmentOptionsModalHide={this.onAttachmentOptionsModalHide}
        />
      )
    }

    onAttachmentLongPress(attachmentId) {
      this.setState({
        isAttachmentOptionsModalOpen: true,
        attachmentOptionsModalParams: {
          attachmentId,
        }
      })
    }

    onAttachmentOptionsModalHide() {
      this.setState({
        isAttachmentOptionsModalOpen: false,
        attachmentOptionsModalParams: {
          attachmentId: null,
        }
      })
    }

    onOpenDeleteConfirmationModal(attachmentId) {
      this.setState({
        isDeleteConfirmationModalOpen: true,
        deleteConfirmationModalParams: {
          attachmentId: attachmentId,
        }
      })
    }

    onHideDeleteConfirmationModal() {
      this.setState({
        isDeleteConfirmationModalOpen: false,
        deleteConfirmationModalParams: {
          attachmentId: null,
        }
      })
    }

    onDeleteFile(fileId) {
      this.props.onDeleteTaskAttachment(fileId)
      this.onHideDeleteConfirmationModal()
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
