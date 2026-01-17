import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'

import { View, Text, Switch } from 'react-native'
import { doNothing } from 'common/utils'

IOSSettingsSwitch.propTypes = {
  shouldRenderTextStatus: PropTypes.bool,
  textStatusValueMap: PropTypes.shape({
    off: PropTypes.string,
    on: PropTypes.string,
  }),
  value: PropTypes.bool,
  onChange: PropTypes.func,
}

IOSSettingsSwitch.defaultProps = {
  shouldRenderTextStatus: false,
  textStatusValueMap: {
    off: 'Disabled',
    on: 'Active',
  },
  value: false,
  onChange: doNothing,
}


function IOSSettingsSwitch(props) {
  const title = props.value ? props.textStatusValueMap.on : props.textStatusValueMap.off
  return (
    <View style={styles.wrapper}>
      {props.shouldRenderTextStatus && <Text style={styles.title}>{title}</Text>}
      <Switch value={props.value} onValueChange={props.onChange} />
    </View>
  )
}

export default IOSSettingsSwitch
