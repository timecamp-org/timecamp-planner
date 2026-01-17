import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import isToday from 'date-fns/is_today'
import { doNothing } from 'common/utils'
import { isImage } from 'models/domain/FilesModel/helpers'
import { blueGreyColor } from 'common/commonStyles/colors'

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import File from 'Icons/File'
import PersonFullName from '../../person/PersonFullName'
import TimeOutput from '../../time/TimeOutput'
import ProgressiveFileImage from 'commonComponents/ProgressiveFileImage'
import ActionSheet from '../ActionSheet'

CardAttachment.propTypes = {
  id: PropTypes.string.isRequired,
  isConfirmDeleteModalOpen: PropTypes.bool,
  color: PropTypes.string,
  fileUrl: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  fileTimestamp: PropTypes.number.isRequired,
  fileUserId: PropTypes.string.isRequired,
  fileContentType: PropTypes.string.isRequired,
  isActionSheetOpen: PropTypes.bool,
  actionSheetOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  destructiveOptions: PropTypes.arrayOf(PropTypes.string).isRequired,

  onCloseActionSheet: PropTypes.func,
  onDeleteFile: PropTypes.func,
}

CardAttachment.defaultProps = {
  isConfirmDeleteModalOpen: false,
  fileUrl: '',
  fileName: '',
  fileContentType: '',
  fileTimestamp: 0,
  isActionSheetOpen: false,

  onPress: doNothing,
  onCloseActionSheet: doNothing,
  onSelectActionSheetOption: doNothing,

  onDeleteFile: doNothing,
}

function CardAttachment(props) {
  const isImageAttachment = isImage(props.fileContentType)

  if (isImageAttachment) {
    return (
      <View style={styles.attachment}>
        <ProgressiveFileImage
          fileId={props.id}
          style={styles.image}
          onDelete={props.onDeleteFile}
          isPreviewable={true}
          onLongPress={props.onPress}
        />
        {renderActionSheet(props)}
        {renderAttachmentDetails(props)}
      </View>
    )
  } else {
    return (
      <TouchableOpacity style={styles.attachment} onPress={props.onPress}>
        <File style={styles.fileIcon} color={blueGreyColor} />
        {renderAttachmentDetails(props)}
        {renderActionSheet(props)}
      </TouchableOpacity>
    )
  }
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

function renderActionSheet(props) {
  function renderOption(option) {
    const isDestructiveOption = props.destructiveOptions.includes(option)
    return <Text style={StyleSheet.flatten([styles.option, isDestructiveOption ? styles.optionDestructive : null])}>{option}</Text>
  }
  return (
    <ActionSheet
      title={'Choose an option:'}
      isVisible={props.isActionSheetOpen}
      options={props.actionSheetOptions.map(renderOption)}
      onClose={props.onCloseActionSheet}
      onSelectOption={props.onSelectActionSheetOption}
    />
  )
}

export default CardAttachment
