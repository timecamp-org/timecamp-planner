import React from 'react'
import { TouchableOpacity, ScrollView, Text } from 'react-native'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { List } from 'immutable'

import styles from './styles'
import { doNothing } from 'common/utils'
import { gridCellSize } from 'styles/common'

import PersonFullName from '../../person/PersonFullName'
import PersonIcon from '../../person/PersonIcon'

const emptyList = new List()

MentionPicker.propTypes = {
  isVisible: PropTypes.bool,
  hails: ImmutablePropTypes.list,
  userIds: ImmutablePropTypes.list,

  onUserRowClick: PropTypes.func,
  onHailRowClick: PropTypes.func,
}

MentionPicker.defaultProps = {
  isVisible: false,
  hails: emptyList,
  userIds: emptyList,

  onUserRowClick: doNothing,
  onHailRowClick: doNothing,
}

const personIconSize = gridCellSize * 4

export default function MentionPicker(props) {
  if (props.isVisible) {
    return (
      <ScrollView style={styles.container} keyboardShouldPersistTaps={'always'}>
        {
          props.hails.map(renderHail)
        }
        {
          props.userIds.map(renderUserRow)
        }
      </ScrollView>
    )
  } else {
    return null
  }

  function renderUserRow(userId) {
    return (
      <TouchableOpacity
        key={`MentionPickerUserRow_${userId}`}
        style={styles.userRow}
        onPress={() => props.onUserRowClick(userId)}
      >
        <PersonIcon
          userId={userId}
          size={personIconSize}
          style={styles.userIcon}
        />
        <PersonFullName userId={userId} />
      </TouchableOpacity>
    )
  }

  function renderHail(hail) {
    return (
      <TouchableOpacity
        key={`MentionPickerUserRow_${hail}`}
        style={styles.userRow}
        onPress={() => props.onHailRowClick(hail)}
      >
        <Text>
          {`@${hail}`}
        </Text>
      </TouchableOpacity>
    )
  }
}
