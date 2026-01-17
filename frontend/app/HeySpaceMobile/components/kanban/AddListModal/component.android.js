import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import UniversalModal from 'commonComponents/UniversalModal'

import ProjectName from '../../projects/ProjectName'

import styles from './styles'
import { doNothing } from 'common/utils';

AddListModal.propTypes = {
  onClose: PropTypes.func,
}

AddListModal.defaultProps = {
  onClose: doNothing,
}

export default function AddListModal(props) {
  return (
    <UniversalModal
      isVisible={true}
      style={styles.modal}
      onBackdropPress={props.onClose}
    >
      <View style={styles.component}>
        <Text style={styles.header} numberOfLines={1}>
          {'Add list to '}
          <ProjectName projectId={props.projectId} />
        </Text>
        <View style={styles.content}>
          <TextInput
            placeholder={'name'}
            underlineColorAndroid={props.color}
            style={styles.textInput}
            onChangeText={props.onChangeText}
            onSubmitEditing={props.onSubmit}
            autoFocus
          />
        </View>
        <View style={styles.footer}>
          <TouchableOpacity onPress={props.onCancel} style={styles.footerButton}>
            <Text
              style={{
                ...styles.footerButtonText,
                color: props.color,
              }}
            >
              {'CANCEL'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={props.onSubmit} style={styles.footerButton}>
            <Text
              style={{
                ...styles.footerButtonText,
                color: props.color,
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
