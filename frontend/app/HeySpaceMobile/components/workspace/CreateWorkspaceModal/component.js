import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'

import { SafeAreaView, View, ScrollView, Text, TouchableOpacity } from 'react-native'
import UniversalModal from 'commonComponents/UniversalModal'
import X from 'components/Icons/X'
import Input from 'components/credentials/Input'
import PrimaryButton from 'commonComponents/PrimaryButton'
import { cloudyBlueColor, whiteTwoColor } from 'common/commonStyles/colors'

CreateWorkspaceModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  isWorkspaceNameValid: PropTypes.bool.isRequired,
  isSubmittingCreateWorkspace: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setOuterWorkspaceNameInputRef: PropTypes.func.isRequired,
  validateWorkspaceName: PropTypes.func.isRequired,
  onCreateWorkspace: PropTypes.func.isRequired,
}

function CreateWorkspaceModal(props) {
  return (
    <UniversalModal
      style={styles.modal}
      isVisible={props.isVisible}
      onBackdropPress={props.onClose}
      onBackButtonPress={props.onClose}
      backdropOpacity={1}
      backdropColor={whiteTwoColor}
    >
      <SafeAreaView style={styles.modalContent}>
        <View style={styles.top}>
          <TouchableOpacity style={styles.closeIcon} onPress={props.onClose}>
            <X color={cloudyBlueColor} />
          </TouchableOpacity>
        </View>
        <View style={styles.innerContent}>
          <Text style={styles.title}>{'Create a new workspace'}</Text>
          <Text style={styles.description}>{'Choose a name for your workspace. For most of the people this is the name of their company. You can always change it later.'}</Text>
          <Input
            outerRef={props.setOuterWorkspaceNameInputRef}
            primaryHeaderText={'Workspace name:'}
            placeholder={'My awesome workspace'}
            validator={props.validateWorkspaceName}
            onChangeText={props.onChangeText}
          />
          <PrimaryButton
            style={styles.button}
            text={props.isSubmittingCreateWorkspace ? 'Creating workspace...' : 'Create workspace'}
            isDisabled={!props.isWorkspaceNameValid || props.isSubmittingCreateWorkspace}
            onPress={props.onCreateWorkspace}
          />
        </View>
      </SafeAreaView>
    </UniversalModal>
  )
}

export default CreateWorkspaceModal
