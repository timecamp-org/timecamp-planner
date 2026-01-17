import React from 'react'
import PropTypes from 'prop-types'
import { Text, View, Switch } from 'react-native'
import Color from 'color'

import Eye from 'Icons/Eye'
import styles from './styles'
import { doNothing } from 'common/utils'
import {
  wisteriaColor,
  blueGreyColor,
  silverChaliceColor,
} from 'common/commonStyles/colors'

FollowListSwitcher.propTypes = {
  color: PropTypes.string,
  isDisabled: PropTypes.bool,
  value: PropTypes.bool,
  onValueChange: PropTypes.func,
  getLabel: PropTypes.func,
}

FollowListSwitcher.defaultProps = {
  color: wisteriaColor,
  isDisabled: false,
  value: false,
  onValueChange: doNothing,
}

export default function FollowListSwitcher(props) {
  const checkedTrackColor = Color(props.color).lighten(0.2).hex()
  return (
    <View style={styles.component}>
      <Eye
        svgProps={{ style: styles.eyeIcon }}
        currentColor={blueGreyColor}
      />
      <Text style={styles.label}>
        {props.getLabel ? props.getLabel() : 'Follow'}
      </Text>
      <Switch
        value={props.value}
        disabled={props.isDisabled}
        onValueChange={props.onValueChange}
        trackColor={{
          false: silverChaliceColor,
          true: props.isDisabled ? silverChaliceColor : checkedTrackColor,
        }}
        thumbColor={props.isDisabled ? undefined : props.value ? props.color : undefined}
      />
    </View>
  )

}
