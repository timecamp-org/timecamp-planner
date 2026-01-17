import React from 'react'
import styles from './styles'

import { View, TouchableOpacity } from 'react-native'
import SpaceIcon from '../SpaceIcon'
import SpaceName from '../SpaceName'
import { useComponent } from './hook'
import { Id } from '../../../../common/utils/identifier'
import { doNothing } from 'common/utils'

export type SpaceRowInterface = {
  spaceId: Id,
  isJoinable?: boolean,
  onClose?: VoidFunction,
}

const defaultProps = {
  isJoinable: false,
  onClose: doNothing,
}

const SpaceRow: React.FC<SpaceRowInterface> = (props) => {
  const hook = useComponent(props)
  return (
    <TouchableOpacity
      key={props.spaceId}
      onPress={hook.onPress}
    >
      <View style={styles.spaceListItem}>
        <SpaceIcon style={styles.planetIcon} spaceId={props.spaceId} />
        <SpaceName spaceId={props.spaceId} />
      </View>
    </TouchableOpacity>
  )
}


SpaceRow.defaultProps = defaultProps

export default SpaceRow
