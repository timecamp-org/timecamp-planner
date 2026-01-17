import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import UniversalModal from 'commonComponents/UniversalModal'

import styles, { pickerStyles } from './styles'
import { doNothing } from 'common/utils'
import { slate60Color, wisteriaColor } from 'common/commonStyles/colors'

import PickerSelect from 'react-native-picker-select'
import ListName from '../../list/ListName'

MoveListModal.propTypes = {
  onClose: PropTypes.func,
}

MoveListModal.defaultProps = {
  onClose: doNothing,
}

export default function MoveListModal(props) {
  const color = props.listColor ? props.listColor : wisteriaColor
  return (
    <UniversalModal
      isVisible={props.isVisible}
      style={styles.modal}
      onBackdropPress={props.onClose}
    >
      <View style={styles.component}>
        <Text style={styles.header}>
          {'Move'}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          <ListName listId={props.listId} />
          {' list to'}
        </Text>
        <View style={styles.content}>
          <PickerSelect
            items={props.spaceIds.toArray().map(spaceId => ({ label: props.projectNames.get(spaceId), value: spaceId, key: spaceId }))}
            hideIcon
            style={pickerStyles}
            onValueChange={props.onSpaceChange}
            value={props.selectedSpaceId}
          />
          <TextInput
            placeholder={'Position:'}
            placeholderTextColor={slate60Color}
            keyboardType='numeric'
            underlineColorAndroid={color}
            style={styles.textInput}
            value={props.selectedPosition}
            onChangeText={props.onChangeText}
            onSubmitEditing={props.onSubmit}
          />
        </View>
        <View style={styles.footer}>
          <TouchableOpacity onPress={props.onCancel} style={StyleSheet.flatten([styles.footerButton, styles.leftButton])}>
            <Text
              style={styles.footerButtonText}
            >
              {'CANCEL'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={props.onSubmit} style={styles.footerButton}>
            <Text
              style={styles.footerButtonText}
            >
              {'OK'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </UniversalModal>
  )
}
