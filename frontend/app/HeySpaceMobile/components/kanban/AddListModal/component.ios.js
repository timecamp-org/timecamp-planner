import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import UniversalModal from 'commonComponents/UniversalModal'

import ProjectName from '../../projects/ProjectName'

import styles from './styles'
import { doNothing } from 'common/utils';
import { slate60Color } from '../../../../common/commonStyles/colors'

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
            placeholderTextColor={slate60Color}
            style={styles.textInput}
            onChangeText={props.onChangeText}
            onSubmitEditing={props.onSubmit}
            autoFocus
          />
        </View>
        <View style={styles.footer}>
          <TouchableOpacity onPress={props.onCancel} style={StyleSheet.flatten([styles.footerButton, styles.leftButton])}>
            <Text
              style={{
                ...styles.footerButtonText,
              }}
            >
              {'CANCEL'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={props.onSubmit} style={styles.footerButton}>
            <Text
              style={{
                ...styles.footerButtonText,
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
