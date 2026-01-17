import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.js'

import { Animated, Text, TouchableOpacity } from 'react-native'
import PrimaryButton from 'commonComponents/PrimaryButton'

BottomDescriptionEditorButtons.propTypes = {
  onSaveDescription: PropTypes.func.isRequired,
  onCancelEditingDescription: PropTypes.func.isRequired,
}

function BottomDescriptionEditorButtons(props) {
  return (
    <Animated.View style={{ ...styles.bottomButtons, marginBottom: props.paddingInput }}>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={props.onCancelEditingDescription}
      >
        <Text style={styles.cancelButtonText}>{'Cancel'}</Text>
      </TouchableOpacity>
      <PrimaryButton
        style={styles.saveButton}
        onPress={props.onSaveDescription}
        text={'Save description'}
      />
    </Animated.View>
  )
}

export default BottomDescriptionEditorButtons
