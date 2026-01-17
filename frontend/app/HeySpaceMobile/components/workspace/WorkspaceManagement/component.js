import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import styles from './styles'

import { SafeAreaView, View, Text, ScrollView, TouchableOpacity } from 'react-native'
import CreateWorkspaceModal from '../CreateWorkspaceModal'
import WorkspaceTile from '../WorkspaceTile'

WorkspaceManagement.propTypes = {
  isCreateModalOpen: PropTypes.bool,
  organizationIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
  onSetIsCreateWorkspaceModalOpen: PropTypes.func.isRequired,
}

WorkspaceManagement.defaultProps = {
  isCreateModalOpen: false,
}

function WorkspaceManagement(props) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{'Your workspaces'}</Text>
      <ScrollView>
        {props.organizationIds.map(renderWorkspace)}
      </ScrollView>
      <View style={styles.divider} />
      <TouchableOpacity
        style={styles.workspaceButton}
        onPress={() => props.onSetIsCreateWorkspaceModalOpen(true)}
      >
        <Text style={styles.buttonText}>{'Add a new workspace...'}</Text>
      </TouchableOpacity>
      <CreateWorkspaceModal
        isVisible={props.isCreateModalOpen}
        onClose={() => props.onSetIsCreateWorkspaceModalOpen(false)}
      />
    </SafeAreaView>
  )
}

function renderWorkspace(organizationId) {
  return <WorkspaceTile
    organizationId={organizationId}
    key={organizationId}
    style={styles.workspaceTile}
  />
}

export default WorkspaceManagement
