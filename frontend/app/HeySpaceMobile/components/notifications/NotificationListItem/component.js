import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity } from 'react-native'
import { doNothing } from 'common/utils'
import isYesterday from 'date-fns/is_yesterday'
import isToday from 'date-fns/is_today'
import NotificationIcon from '../NotificationIcon'
import NotificationText from '../NotificationText'
import TimeOutput from '../../time/TimeOutput'
import DateOutput from '../../date/DateOutput'
import styles from './styles'

import PureBaseComponent from 'PureBaseComponent'

class NotificationListItem extends PureBaseComponent {

  static propTypes = {
    notificationId: PropTypes.string,
    shouldDisplayDate: PropTypes.bool,

    // @Enhancer
    notificationLink: PropTypes.string,
    creationTimestamp: PropTypes.number.isRequired,
    isArchived: PropTypes.bool.isRequired,
    isUnread: PropTypes.bool.isRequired,
    mainColor: PropTypes.string,
    isMouseOver: PropTypes.bool.isRequired,

    onClick: PropTypes.func.isRequired,
  }

  static defaultProps = {
    shouldDisplayDate: false,
    isArchived: false,
    isUnread: false,
    isMouseOver: false,

    onClick: doNothing,
  }

  render() {
    const componentStyles = styles.Component
    const unreadStyles = this.props.isUnread ? styles.unreadBackground : {}
    return (
      <TouchableOpacity style={{ ...componentStyles, ...unreadStyles }} onPress={this.props.onClick}>
        <View style={styles.left}>
          <NotificationIcon notificationId={this.props.notificationId} />
          <View style={styles.content}>
            <NotificationText notificationId={this.props.notificationId} />
            {this.renderDate()}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderDate() {
    let date
    if (isToday(this.props.creationTimestamp)) {
      date = <Text style={styles.date}>{'Today'}</Text>
    } else if (isYesterday(this.props.creationTimestamp)) {
      date = <Text style={styles.date}>{'Yesterday'}</Text>
    } else {
      date = <DateOutput
        style={styles.date}
        format={'MMM D'}
        timestamp={this.props.creationTimestamp} />
    }
    return <View style={styles.dateWrapper}>
      {date}
      <Text style={styles.date}>{'at'}</Text>
      <TimeOutput
        style={styles.date}
        format={'h:mm A'}
        timestamp={this.props.creationTimestamp} />
    </View>
  }
}

export default NotificationListItem
