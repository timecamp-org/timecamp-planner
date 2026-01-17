import React from 'react'
import { View, Text } from 'react-native'
import PropTypes from 'prop-types'
import styles from './styles'
import { iOSSettingsSecondaryTextColor } from 'common/commonStyles/colors'
import isNil from 'lodash/isNil'
import ChevronRight from "components/Icons/ChevronRight"

IOSSettingsButtonRightLink.propTypes = {
  title: PropTypes.oneOfType(PropTypes.string, PropTypes.number),
  additionalElement: PropTypes.element
}


function IOSSettingsButtonRightLink(props) {
  return (
    <View style={styles.wrapper}>
      {!isNil(props.title) && <Text style={styles.title}>{props.title}</Text>}
      {!isNil(props.additionalElement) && props.additionalElement}
      <ChevronRight color={iOSSettingsSecondaryTextColor} style={styles.chevronIcon} />
    </View>
  )
}

export default IOSSettingsButtonRightLink
