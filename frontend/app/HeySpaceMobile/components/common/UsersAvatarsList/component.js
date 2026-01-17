import React from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'react-native'

import PersonIcon from '../../person/PersonIcon'

import styles from './styles'
import { gridCellSize } from 'styles/common'

UsersAvatarsList.propTypes = {
  maxItems: PropTypes.number,
  spaceBetween: PropTypes.number,
  alwaysShowCounter: PropTypes.bool,
}

UsersAvatarsList.defaultProps = {
  maxItems: 3,
  spaceBetween: 2 * gridCellSize,
  alwaysShowCounter: false,
}

export default function UsersAvatarsList(props) {
  const { size } = props.userIds
  const maxItems = props.maxItems >= 0 ? props.maxItems : size
  return (
    <View style={{ ...styles.component, ...props.componentStyles }}>
      {
        props.userIds.slice(0, size === maxItems || maxItems < 0 ? maxItems : maxItems - 1).map(renderUserIcon)
      }
      {
        (size > maxItems && maxItems >= 0) || props.alwaysShowCounter
          ? props.countRenderer ? props.countRenderer(maxItems, size, props.spaceBetween) : renderCount(maxItems, size, props.spaceBetween)
          : null
      }
    </View>
  )

  function renderUserIcon(userId, index) {
    return (
      <View
        key={`UsersAvatarsList_${userId}`}
        style={{ marginLeft: index > 0 ? -1 * props.spaceBetween : 0 }}
      >
        <PersonIcon
          userId={userId}
        />
      </View>
    )
  }
}

function renderCount(maxItems, size, spaceBetween) {
  return (
    <View
      style={{
        ...styles.count,
        marginLeft: -1 * spaceBetween,
      }}
    >
      <Text>
        {`+${(size - maxItems) + 1}`}
      </Text>
    </View>
  )
}
