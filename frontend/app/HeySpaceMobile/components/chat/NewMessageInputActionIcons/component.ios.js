import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { cloudyBlueColor } from 'common/commonStyles/colors'
import { doNothing } from 'common/utils'

import { Text, TouchableOpacity, View } from 'react-native'
import ActionSheet from '../../kanban/ActionSheet'
import Paperclip from '../../Icons/Paperclip'

NewMessageInputActionIcons.propTypes = {
  objectId: PropTypes.string.isRequired,
  isActionSheetOpen: PropTypes.bool,
  isCameraRollPickerOpen: PropTypes.bool,
  selectedFiles: PropTypes.array,
  listOptions: PropTypes.array.isRequired,
  onOpenActionSheet: PropTypes.func,
  onCloseActionSheet: PropTypes.func,
  onSelectOption: PropTypes.func,
  onCloseCameraRollPicker: PropTypes.func,
  onSelectCameraRollImages: PropTypes.func,
  onUploadSelectedCameraRollImages: PropTypes.func,
}

NewMessageInputActionIcons.defaultProps = {
  isActionSheetOpen: false,
  isCameraRollPickerOpen: false,
  selectedFiles: [],
  onOpenActionSheet: doNothing,
  onCloseActionSheet: doNothing,
  onSelectOption: doNothing,
  onCloseCameraRollPicker: doNothing,
  onSelectCameraRollImages: doNothing,
  onUploadSelectedCameraRollImages: doNothing,
}

function NewMessageInputActionIcons(props) {
  return (
    <React.Fragment>
      <View style={styles.icons}>

        <TouchableOpacity
          style={styles.button}
          onPress={props.onOpenActionSheet}
        >
          <Paperclip style={styles.icon} color={cloudyBlueColor} />
        </TouchableOpacity>

      </View>

      <ActionSheet
        title={'Upload file from:'}
        isVisible={props.isActionSheetOpen}
        options={props.listOptions.map(renderOption)}
        onClose={props.onCloseActionSheet}
        onSelectOption={props.onSelectOption}
      />

    </React.Fragment>
  )
}

function renderOption(option) {
  return <Text style={styles.option}>{option}</Text>
}

export default NewMessageInputActionIcons
