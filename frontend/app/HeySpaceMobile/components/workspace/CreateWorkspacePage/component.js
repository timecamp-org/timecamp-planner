import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'

import { View, Text } from 'react-native'
import Input from 'components/credentials/Input'
import PrimaryButton from 'commonComponents/PrimaryButton'

CreateWorkspacePage.propTypes = {
  isWorkspaceNameValid: PropTypes.bool.isRequired,
  isSubmittingCreateWorkspace: PropTypes.bool.isRequired,
  setOuterWorkspaceNameInputRef: PropTypes.func.isRequired,
  validateWorkspaceName: PropTypes.func.isRequired,
  onCreateWorkspace: PropTypes.func.isRequired,
}

function CreateWorkspacePage(props) {
  return (
    <View style={styles.component}>
      <Text style={styles.title}>{'Set up your workspace'}</Text>
      <Text style={styles.description}>{'Add your workspace name. For most of people this is the name of their company. You can always change later.'}</Text>
      <Input
        outerRef={props.setOuterWorkspaceNameInputRef}
        primaryHeaderText={'Workspace name:'}
        placeholder={'My awesome workspace'}
        validator={props.validateWorkspaceName}
        onChangeText={props.onChangeText}
      />
      <PrimaryButton
        style={styles.button}
        text={props.isSubmittingCreateWorkspace ? 'Creating workspace...' : 'Start exploring'}
        isDisabled={!props.isWorkspaceNameValid || props.isSubmittingCreateWorkspace}
        onPress={props.onCreateWorkspace}
      />
    </View>
  )
}

export default CreateWorkspacePage
