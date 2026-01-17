import React from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity } from 'react-native'

import styles from './styles'
import PersonIcon from '../../person/PersonIcon'
import PersonFullName from '../../person/PersonFullName'
import TimeOutput from '../../time/TimeOutput'
import MessageText from '../MessageText'
import MessageAttachment from '../MessageAttachment'

import UsersReadList from '../../chat/UsersReadList'
import MessageReactions from '../../chat/MessageReactions'
import isIOS from '../../../utils/isIOS'

const personIconSize = 30

Message.propTypes = {
  id: PropTypes.string.isRequired,
  firstMessageAttachmentId: PropTypes.string,
}

export default function Message(props) {
  return (
    <View style={styles.container} ref={props.onSetRef}>
      <View style={styles.left}>
        {
          props.isContinuation || <PersonIcon
            userId={props.userId}
            style={styles.personIcon}
            size={personIconSize}
          />
        }
      </View>
      <View style={styles.right}>
        {
          props.isContinuation || <View style={styles.messageInfo}>
            <PersonFullName
              userId={props.userId}
              style={styles.personName}
            />
            <TimeOutput
              timestamp={props.dateAdded}
              format={'HH:mm'}
              style={styles.messageTimestamp}
            />
          </View>
        }
        {
          props.firstMessageAttachmentId
            ? <MessageAttachment
              messageId={props.id}
              attachmentId={props.firstMessageAttachmentId}
              onLongPress={props.onLongPress}
            />
            : <TouchableOpacity
              onLongPress={props.onLongPress}
            >
              <MessageText messageId={props.id} onLongPressLink={props.onLongPress} />
            </TouchableOpacity>
        }
        {
          !isIOS
            ? <MessageReactions messageId={props.id} />
            : null
        }
        <UsersReadList messageId={props.id} />
      </View>
    </View>
  )
}
