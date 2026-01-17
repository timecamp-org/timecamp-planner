import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { List } from 'immutable'
import { NotificationType } from 'models/domain/NotificationsModel/types'

import PersonIcon from '../../person/PersonIcon'
import { View, Image } from 'react-native'
import styles from './styles'
import Assets from 'common/commonAssets'


NotificationIcon.propTypes = {
  actorId: PropTypes.string,
  activityChanges: ImmutablePropTypes.list,
  shouldRenderPersonIcon: PropTypes.bool,
  size: PropTypes.number,
}

NotificationIcon.defaultProps = {
  activityChanges: new List(),
  shouldRenderPersonIcon: true,
  size: 36,
}

function NotificationIcon(props) {
  return (
    <View
      style={styles.Component}>
      {
        props.shouldRenderPersonIcon
          ? renderPersonIcon(props)
          : renderMascotIcon(props)
      }
    </View>
  )
}

function renderPersonIcon(props) {
  return (
    <PersonIcon userId={props.actorId} className={styles.personIcon} />
  )
}

function renderMascotIcon(props) {
  switch (props.notificationType) {
    case NotificationType.INVITATION_JOINED:
      return <Image
        source={{ uri: Assets.CHARACTER_20 }}
        style={getCircleStyle(props)}
      />
    default: return <Image
      source={{ uri: Assets.CHARACTER_33 }}
      style={getCircleStyle(props)}
    />
  }
}


function getCircleStyle(props) {
  return {
    ...styles.circle,
    width: props.size,
    height: props.size,
    borderRadius: (props.size / 2),
  }
}

export default NotificationIcon
