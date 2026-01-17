import React, { memo, FC } from 'react'
import styles from './styles'
import { ProjectType } from 'models/domain/ProjectsModel/types'

import { doNothing } from 'common/utils'
import { TouchableOpacity, View, Text } from 'react-native'
import PersonIcon from '../../person/PersonIcon'
import PersonFullName from '../../person/PersonFullName'
import GroupConversationIcon from '../GroupConversationIcon'
import GroupConversationName from '../GroupConversationName'
import Badge from '../../notifications/Badge/conversationUnreadMessages'
import { Id } from '../../../../common/utils/identifier'
import { List } from 'immutable'
import useComponent, { TeamNavButtonHookInterface } from './hook'


export type TeamNavButtonInterface = {
  conversationId: Id,
  people: List<Id>,
  type: string,
  isSelected?: boolean,
}


const defaultProps = {
  isSelected: false,

  onPress: doNothing,
}

const TeamNavButton: FC<TeamNavButtonInterface> = (props) => {
  const hook = useComponent(props)
  return (
    <TouchableOpacity
      style={props.isSelected ? { ...styles.button, ...styles.selectedButton } : styles.button}
      onPress={hook.onPress}
    >
      <View style={styles.buttonContent}>
        {renderContent(props, hook)}
        <Badge spaceId={hook.projectId} style={styles.badge} />
      </View>
    </TouchableOpacity>
  )
}


function renderContent(
  props: TeamNavButtonInterface,
  hook: TeamNavButtonHookInterface,
) {
  switch (props.type) {
    case ProjectType.GROUP_CHAT: {
      return renderGroupConversationButton(props)
    }
    case ProjectType.DIRECT_CHAT: {
      if (props.people.size === 1) {
        return renderOwnConversationButton(props)
      } else {
        return renderDirectChatButton(hook)
      }
    }
    default: {
      throw new Error(`Unrecognized chat type: ${props.type}`)
    }
  }
}

function renderGroupConversationButton(props: TeamNavButtonInterface) {
  return (
    <>
      <GroupConversationIcon conversationId={props.conversationId} />
      <GroupConversationName style={styles.conversationName} conversationId={props.conversationId} />
    </>
  )
}

function renderDirectChatButton(
  hook: TeamNavButtonHookInterface,
) {
  const isGuestHintVisible = hook.isUserGuest && hook.isUserActive
  return (
    <>
      <PersonIcon userId={hook.conversationUserId} />
      <View style={styles.personFullNameWithHint}>
        <PersonFullName
          style={styles.conversationName}
          userId={hook.conversationUserId}
        />
        {!hook.isUserActive && <Text style={styles.disabledHint}>{'(Disabled)'}</Text>}
        {isGuestHintVisible && <Text style={styles.userHint}>{'Guest'}</Text>}
      </View>
    </>
  )
}

function renderOwnConversationButton(props: TeamNavButtonInterface) {
  const currentUserId = props.people.first()
  return (
    <>
      <PersonIcon userId={currentUserId} />
      <PersonFullName
        style={styles.conversationName}
        userId={currentUserId}
        shouldAddYouInParenthesesIfCurrent
      />
    </>
  )
}

TeamNavButton.defaultProps = defaultProps


export default memo(TeamNavButton)