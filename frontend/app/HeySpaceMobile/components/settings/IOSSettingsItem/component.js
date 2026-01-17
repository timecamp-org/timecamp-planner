import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { doNothing } from 'common/utils'

import { TouchableOpacity, Text } from 'react-native'

IOSSettingsItem.propTypes = {
  title: PropTypes.string,
  renderTitle: PropTypes.func,
  right: PropTypes.element,
  onPress: PropTypes.func,
}

IOSSettingsItem.defaultProps = {
  title: '',
  onPress: doNothing,
}

function IOSSettingsItem(props) {
  return (
    <TouchableOpacity
      style={styles.wrapper}
      onPress={props.onPress}
    >
      {props.renderTitle
        ? props.renderTitle()
        : <Text style={styles.title}>{props.title}</Text>}
      {props.right ? props.right : null}
    </TouchableOpacity>
  )
}

export default React.memo(IOSSettingsItem)
