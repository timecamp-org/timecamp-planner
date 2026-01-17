import { Id } from '../../../../common/utils/identifier';
import React, { FC } from 'react'
import { TouchableOpacity, View, Image, Text } from 'react-native'
import styles from './styles'
import useComponent from './hook';
import { AnyDict } from 'common/types'

export type WorkspaceTileInterface = {
  organizationId: Id,
  style?: AnyDict,
}

const WorkspaceTile: FC<WorkspaceTileInterface> = (props) => {
  const hook = useComponent(props)
  return (
    <TouchableOpacity
      key={props.organizationId}
      style={props.style}
      onPress={hook.onSwitchOrganization}
    >
      <View style={styles.workspaceButton}>
        {hook.organizationLogo ? renderLogo(hook.organizationLogo) : renderInitials(hook.organizationInitials)}
        <Text style={styles.buttonText}>
          {hook.organizationName}
        </Text>

      </View>
    </TouchableOpacity>
  )
}

function renderLogo(organizationLogo: string) {
  return (
    <Image
      source={{ uri: organizationLogo }}
      style={styles.image}
    />
  )
}

function renderInitials(organizationInitials: string) {
  return (
    <View style={styles.initials}>
      <Text style={styles.initialsText}>{organizationInitials}</Text>
    </View>
  )
}

export default WorkspaceTile