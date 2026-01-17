import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import UniversalModal from 'commonComponents/UniversalModal'

import styles from './styles'
import { doNothing } from 'common/utils';
import { wisteriaColor } from 'common/commonStyles/colors';

EditListNameModal.propTypes = {
  onClose: PropTypes.func,
}

EditListNameModal.defaultProps = {
  onClose: doNothing,
}

export default function EditListNameModal(props) {
  const color = props.listColor ? props.listColor : wisteriaColor
  return (
    <UniversalModal
      isVisible={props.isVisible}
      style={styles.modal}
      onBackdropPress={props.onClose}
    >
      <View style={styles.component}>
        <Text style={styles.header} numberOfLines={1}>
          {'List name: '}
        </Text>
        <View style={styles.content}>
          <TextInput
            placeholder={'name'}
            underlineColorAndroid={color}
            style={styles.textInput}
            onChangeText={props.onChangeText}
            onSubmitEditing={props.onSubmit}
            value={props.name}
            autoFocus
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
