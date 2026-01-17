import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import styles from './styles'
import { List } from 'immutable'

import { View, StyleSheet } from 'react-native'
import CardAttachment from '../CardAttachment'

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
          onDeleteFile={() => props.onDeleteFile(taskAttachmentId)} />
      ))}
    </View>
  )
}

export default CardAttachments