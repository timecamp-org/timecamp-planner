import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'

import { View, Text, TouchableOpacity } from 'react-native'
import FileUpload from 'commonComponents/FileUpload'
import CardAttachments from '../../kanban/CardAttachments'
import Paperclip from 'Icons/Paperclip'
import { cloudyBlueColor, wisteriaColor } from 'common/commonStyles/colors'

CardDetailsAttachments.propTypes = {
  taskId: PropTypes.string.isRequired,
  onUploadFiles: PropTypes.func.isRequired,
}

function CardDetailsAttachments(props) {
  return (
    <View style={styles.container}>
      <View style={styles.sectionTitle}>
        <Paperclip style={styles.icon} color={cloudyBlueColor} />
        <Text style={styles.sectionTitleText}>{'Attachments'}</Text>
      </View>
      <View style={styles.uploadFilesWrapper}>
        <FileUpload onUploadFiles={props.onUploadFiles}>
          {(openFilePicker) => (
            <TouchableOpacity
              style={styles.browseFilesButton}
              onPress={openFilePicker}
            >
              <Text style={{ ...styles.browseButtonText, color: props.taskColor || wisteriaColor }}>{'Browse'}</Text>
            </TouchableOpacity>
          )}
        </FileUpload>
        <Text style={styles.browseText}>{` to add attachment`}</Text>
      </View>
      <CardAttachments taskId={props.taskId} style={styles.attachments} />
    </View>
  )
}

export default CardDetailsAttachments
