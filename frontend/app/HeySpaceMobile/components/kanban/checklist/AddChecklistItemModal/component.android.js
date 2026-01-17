import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { doNothing } from 'common/utils'
import { wisteriaColor } from 'common/commonStyles/colors'

import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import UniversalModal from 'commonComponents/UniversalModal'

AddChecklistItemModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onChangeText: PropTypes.func,
  onCreateChecklistItem: PropTypes.func,
}

AddChecklistItemModal.defaultProps = {
  onClose: doNothing,
}

export default function AddChecklistItemModal(props) {
  const color = props.taskColor ? props.taskColor : wisteriaColor
  return (
    <UniversalModal
      isVisible={props.isVisible}
      style={styles.modal}
      onBackdropPress={props.onClose}
    >
      <View style={styles.component}>
        <Text style={styles.header} numberOfLines={1}>
          {'Add checklist item'}
        </Text>
        <View style={styles.content}>
          <TextInput
            placeholder={'name'}
            underlineColorAndroid={color}
            style={styles.textInput}
            onChangeText={props.onChangeText}
            onSubmitEditing={props.onCreateChecklistItem}
            autoFocus
          />
        </View>
        <View style={styles.footer}>
          <TouchableOpacity onPress={props.onClose} style={styles.footerButton}>
            <Text
              style={{
                ...styles.footerButtonText,
                color,
              }}
            >
              {'CANCEL'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={props.onCreateChecklistItem} style={styles.footerButton}>
            <Text
              style={{
                ...styles.footerButtonText,
                color,
              }}
            >
              {'ADD'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </UniversalModal>
  )
}
