import React, { memo, FC } from 'react'
import styles from './styles'

import { TouchableOpacity, View, Text } from 'react-native'
import SpaceIcon from '../../projects/SpaceIcon'
import SpaceName from '../../projects/SpaceName'
import Badge from '../../notifications/Badge/spaceUnreadMessages'
import { Id } from '../../../../common/utils/identifier'
import useComponent from './hook'

export type SpaceNavButtonInterface = {
  spaceId: Id,
  isSelected: boolean,
}

const defaultProps = {
  hasUnreadMessages: false,
  isMuted: false,
  isSelected: false,
}

const SpaceNavButton: FC<SpaceNavButtonInterface> = (props) => {
  const hook = useComponent(props)
  return (
    <TouchableOpacity
      style={props.isSelected ? styles.selectedButton : styles.button}
      onPress={hook.onPress}
    >
      <View style={styles.buttonContent}>
        <SpaceIcon
          style={hook.isMuted ? styles.mutedProjectIcon : styles.planetIcon} 
          spaceId={props.spaceId}
        />
        <SpaceName
          style={hook.isMuted
            ? styles.mutedProjectName
            : hook.hasUnreadMessages ? styles.buttonTextUnread : styles.buttonText}
          spaceId={props.spaceId}
          maxLength={20}
        />
        <Badge style={styles.badge} spaceId={props.spaceId} />
      </View>
    </TouchableOpacity>
  )
}

SpaceNavButton.defaultProps = defaultProps

export default memo(SpaceNavButton)
