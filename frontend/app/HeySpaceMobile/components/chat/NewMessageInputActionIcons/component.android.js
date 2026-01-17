import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { cloudyBlueColor } from 'styles/colors'
import { doNothing } from 'common/utils'

import Paperclip from '../../Icons/Paperclip'
import FileUpload from '../../common/FileUpload'
import { TouchableOpacity, View } from 'react-native'

NewMessageInputActionIcons.propTypes = {
  onUploadFiles: PropTypes.func,
}

NewMessageInputActionIcons.defaultProps = {
  onUploadFiles: doNothing,
}

function NewMessageInputActionIcons(props) {
  return (
    <View style={styles.icons}>
      <FileUpload onUploadFiles={props.onUploadFiles}>
        {(openFilePicker) => <TouchableOpacity
          style={styles.button}
          onPress={openFilePicker}
        >
          <Paperclip style={styles.icon} color={cloudyBlueColor} />
        </TouchableOpacity>}
      </FileUpload>
      {/* TODO: enable mention later*/}
      {/* <TouchableOpacity style={styles.button}>
          <AtSign style={styles.icon} color={cloudyBlueColor} />
        </TouchableOpacity> */}

      {/* TODO: enable emot icon after we add custom emojis */}
      {/* <TouchableOpacity style={styles.button}>
          <Emot style={styles.icon} color={cloudyBlueColor} />
        </TouchableOpacity> */}
    </View>
  )

}

export default NewMessageInputActionIcons
