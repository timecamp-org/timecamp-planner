import React from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'react-native'
import styles from './styles'

import { gridCellSize } from '../../../styles/common'

import PersonIcon from '../../person/PersonIcon'

UsersReadList.propTypes = {
  maxIcons: PropTypes.number,
}

UsersReadList.defaultProps = {
  maxIcons: 3,
}

const ICON_SIZE = gridCellSize * 4

export default function UsersReadList(props) {
  if (!props.userIdsRead || props.userIdsRead.size === 0) {
    return null
  }

  return (
    <View style={styles.component}>
      {
        props.userIdsRead.size > props.maxIcons
          ? renderPersonCount()
          : null
      }
      {
        props.userIdsRead.slice(0, props.maxIcons).map(renderUserRow)
      }
    </View>
  )

  function renderUserRow(userId) {
    return (
      <PersonIcon
        key={`UsersReadList_${userId}`}
        style={styles.icon}
        size={ICON_SIZE}
        userId={userId}
        showOnlineIndicator={false}
      />
    )
  }

  function renderPersonCount() {
    return (
      <View style={styles.countWrapper}>
        <Text style={styles.count}>
          {`+${props.userIdsRead.size - props.maxIcons}`}
        </Text>
      </View>
    )
  }
}
