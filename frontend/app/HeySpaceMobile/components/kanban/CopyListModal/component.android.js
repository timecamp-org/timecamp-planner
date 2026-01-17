import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity, TextInput, Picker } from 'react-native'
import UniversalModal from 'commonComponents/UniversalModal'

import styles from './styles'
import { doNothing } from 'common/utils'
import { wisteriaColor } from 'common/commonStyles/colors'

CopyListModal.propTypes = {
  onClose: PropTypes.func,
}

CopyListModal.defaultProps = {
  onClose: doNothing,
}

export default function CopyListModal(props) {
  const color = props.listColor ? props.listColor : wisteriaColor
  return (
    <UniversalModal
      isVisible={props.isVisible}
      style={styles.modal}
      onBackdropPress={props.onClose}
    >
      <View style={styles.component}>
        <Text style={styles.header}>
          {'Copy list'}
        </Text>
        <View style={styles.content}>
          <TextInput
            placeholder={'name'}
            underlineColorAndroid={color}
            style={styles.textInput}
            value={props.name}
            onChangeText={props.onChangeText}
            onSubmitEditing={props.onSubmit}
          />
        </View>
        <View style={styles.footer}>
          <TouchableOpacity onPress={props.onCancel} style={styles.footerButton}>
            <Text
              style={{
                ...styles.footerButtonText,
                color,
              }}
            >
              {'CANCEL'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={props.onSubmit} style={styles.footerButton}>
            <Text
              style={{
                ...styles.footerButtonText,
                color,
              }}
            >
              {'OK'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </UniversalModal>
  )

}
