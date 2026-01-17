import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity } from 'react-native'
import styles from './styles'
import { blueGreyColor } from 'common/commonStyles/colors'

import PersonIcon from '../../person/PersonIcon'
import ChevronDown from 'Icons/ChevronDown'
import NotificationsCenterIcon from '../../notifications/NotificationsCenterIcon'
import isIOS from '../../../utils/isIOS'

CurrentUserNavInfo.propTypes = {
  isSettingsTabSelected: PropTypes.bool,
  currentUserId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  organizationName: PropTypes.string,
  onPress: PropTypes.func.isRequired,
}

CurrentUserNavInfo.defaultProps = {
  isSettingsTabSelected: false,
  organizationName: '',
}

function CurrentUserNavInfo(props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.container}>
        <View style={styles.chevronContainer}>
          <ChevronDown
            color={blueGreyColor}
            style={props.isSettingsTabSelected ? styles.chevronSelected : styles.chevron}
          />
        </View>
        <PersonIcon userId={props.currentUserId} showOnlineIndicator={false} />
        <View style={styles.right}>
          <Text style={styles.username}>{`Hi ${props.username}!`}</Text>
          <Text style={styles.organizationName}>{props.organizationName}</Text>
        </View>
        {isIOS ? <NotificationsCenterIcon /> : null}
      </View>
    </TouchableOpacity>
  )
}

export default CurrentUserNavInfo
