import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import styles from './styles'
import { List } from 'immutable'

import { View, StyleSheet } from 'react-native'
import CardAttachment from '../CardAttachment'
import { AttachmentOptionsModal } from '../AttachmentOptionsModal'
import DeleteConfirmationModal from '../../common/DeleteConfirmationModal'

CardAttachments.propTypes = {
  taskAttachmentsIds: ImmutablePropTypes.list,
  taskId: PropTypes.string.isRequired,
  color: PropTypes.string,
  onDeleteFile: PropTypes.func.isRequired,
}

CardAttachments.defaultProps = {
  taskAttachmentsIds: new List(),
}

function CardAttachments(props) {
  return (
    <View style={StyleSheet.flatten([styles.container, props.style])}>
      {props.taskAttachmentsIds.map((taskAttachmentId) => (
        <CardAttachment
          key={taskAttachmentId}
          id={taskAttachmentId}
          color={props.color}
          taskId={props.taskId}

          onOpenDeleteConfirmationModal={() => props.onOpenDeleteConfirmationModal(taskAttachmentId)}

          onLongPress={() => props.onAttachmentLongPress(taskAttachmentId)}
        />
      ))}
      <AttachmentOptionsModal
        attachmentId={props.attachmentOptionsModalParams.attachmentId}
        isOpen={props.isAttachmentOptionsModalOpen}
        onClose={props.onAttachmentOptionsModalHide}
        onShowDeleteConfirmationModal={() => {
          props.onOpenDeleteConfirmationModal(
            props.attachmentOptionsModalParams.attachmentId
          )
        }}
      />
      <DeleteConfirmationModal
        isVisible={props.isDeleteConfirmationModalOpen}
        title={'Delete attachment'}
        description={'Are you sure you want to delete this attachment? This cannot be undone.'}
        onClose={props.onHideDeleteConfirmationModal}
        onDelete={() => props.onDeleteFile(props.deleteConfirmationModalParams.attachmentId)}
      />
    </View>
  )
}

export default CardAttachments
