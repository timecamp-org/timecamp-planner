import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import isToday from 'date-fns/is_today'
import { doNothing } from 'common/utils'
import { isImage } from 'models/domain/FilesModel/helpers'
import { blueGreyColor, cloudyBlueColor } from 'common/commonStyles/colors'

import { View, Text, TouchableOpacity } from 'react-native'
import Trash from 'Icons/Trash'
import File from 'Icons/File'
import PersonFullName from '../../person/PersonFullName'
import TimeOutput from '../../time/TimeOutput'
import ProgressiveFileImage from 'commonComponents/ProgressiveFileImage'

CardAttachment.propTypes = {
  id: PropTypes.string.isRequired,
  onOpenDeleteConfirmationModal: PropTypes.func.isRequired,
  color: PropTypes.string,
  fileUrl: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  fileTimestamp: PropTypes.number.isRequired,
  fileUserId: PropTypes.string.isRequired,
  fileContentType: PropTypes.string.isRequired,

  onOpenImageGallery: PropTypes.func.isRequired,
  onDownloadFile: PropTypes.func.isRequired,
}

CardAttachment.defaultProps = {
  isConfirmDeleteModalOpen: false,
  fileUrl: '',
  fileName: '',
  fileContentType: '',
  fileTimestamp: 0,

  onOpenImageGallery: doNothing,
}

function CardAttachment(props) {
  return (
    <TouchableOpacity
      style={styles.attachment}
      onPress={props.onPress}
      onLongPress={props.onLongPress}
    >
      {renderAttachmentContent(props)}
      {renderAttachmentDetails(props)}
    </TouchableOpacity>
  )
}

function renderAttachmentContent(props) {
  return (
    <View style={styles.attachmentContent}>
      {isImage(props.fileContentType)
        ? <ProgressiveFileImage
            fileId={props.id}
            style={styles.image}
            isPreviewable={true}
            onLongPress={props.onLongPress}
        />
        : <File style={styles.fileIcon} color={blueGreyColor} />
      }

      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={props.onOpenDeleteConfirmationModal}
      >
        <Trash style={styles.deleteIcon} color={cloudyBlueColor} />
      </TouchableOpacity>
    </View>
  )
}

function renderAttachmentDetails(props) {
  return (
    <View style={styles.messageInfo}>
      <Text>{props.fileName}</Text>
      <View style={styles.attachmentUploadInfo}>
        <Text>{'Added '}</Text>
        <TimeOutput
          timestamp={props.fileTimestamp}
          format={isToday(new Date(props.fileTimestamp)) ? 'HH:mm' : 'MMM D, YYYY'}
        />
        <Text>{' by '}</Text>
        <PersonFullName userId={props.fileUserId} />
      </View>
    </View>
  )
}

export default CardAttachment
