import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { doNothing } from 'common/utils'
import { List } from 'immutable'
import { wisteriaColor, cloudyBlueColor } from 'common/commonStyles/colors'
import { getColorWithAlpha } from 'common/utils/colors'
import styles, { emojiSize } from './styles'
import AppleEmoji from '../../common/AppleEmoji/emojiCode'
import { View, Text, TouchableOpacity } from 'react-native'

Reaction.propTypes = {
  emojiCode: PropTypes.string.isRequired,
  userIds: ImmutablePropTypes.list,
  projectColor: PropTypes.string,
  isCurrentUserReacted: PropTypes.bool,

  onClick: PropTypes.func,
}

Reaction.defaultProps = {
  userIds: new List(),
  projectColor: wisteriaColor,
  isCurrentUserReacted: false,

  onClick: doNothing,
}

function Reaction(props) {
  const borderColor = props.isCurrentUserReacted ? props.projectColor : cloudyBlueColor
  return (
    <TouchableOpacity
      style={{
        ...styles.component,
        borderColor: getColorWithAlpha(borderColor, 0.3),
        backgroundColor: props.isCurrentUserReacted ? getColorWithAlpha(props.projectColor, 0.1) : null,
      }}
      onPress={props.onClick}
    >
      <View style={styles.emoji}>
        <AppleEmoji
          emojiSize={emojiSize}
          emojiCode={props.emojiCode}
        />
      </View>
      <Text style={styles.usersCount} >{props.userIds.size}</Text>
    </TouchableOpacity>
  )
}

export default Reaction
