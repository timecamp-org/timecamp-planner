import React from 'react'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'

import * as MessagesModelActions from 'models/domain/MessagesModel/actions'

import { selectChatMessagePlaceholder } from 'models/domain/ProjectsModel/selectors'
import { selectEntityType } from 'models/domain/EntityModel/selectors'
import { EntityType } from 'models/domain/EntityModel/types'
import { selectUsersNicknames, selectUsersEmail } from 'models/domain/UsersModel/selectors/domain'
import { selectTaskColor } from 'models/domain/TasksModel/selectors'
import { selectProjectColor } from 'models/domain/ProjectsModel/selectors'
import {
  parseStringToInputArray,
  parsePlainTextMessage,
} from '../../../../../utils/markdownUtils'

import { calculateStateAfterKeyPress, getTextWithMentionInserted } from './utils'

function Enhance(ComposedComponent) {
  class EnhanceNewMessageInput extends BaseComponent {

    state = {
      text: '',
      isMentionPickerVisible: false,
      mentionStartPosition: -1,
      mentionSearchValue: '',
    }

    render() {
      return (
        <ComposedComponent
          textElements={parseStringToInputArray(this.state.text, this.props.usersNicknames)}
          placeholder={this.props.placeholder}
          objectId={this.props.objectId}
          color={this.props.color}

          mentionPosition={this.state.mentionPosition}
          mentionSearchValue={this.state.mentionSearchValue}
          isMentionPickerVisible={this.state.isMentionPickerVisible}

          onSetStateAfterInputChange={this.onSetStateAfterInputChange}
          onSelectionChange={this.onSelectionChange}
          onSendMessage={this.onSendMessage}
          onMentionUser={this.onMentionUser}
          onHail={this.onHail}
          onSetInputRef={this.onSetInputRef}
        />
      )
    }

    onSetStateAfterInputChange(pressedKey, selection, inputText = this.state.text) {
      this.setState(prevState =>
        calculateStateAfterKeyPress(pressedKey, inputText, selection, prevState))
    }

    onSendMessage() {
      if (this.state.text.length > 0) {
        const {
          parsedMessageText,
          mentionedUserIds,
          hails,
        } = parsePlainTextMessage(this.state.text, this.props.usersNicknames, this.props.usersEmails)
        this.props.onSendMessage(parsedMessageText, mentionedUserIds, hails)
        this.setState({
          text: '',
          isMentionPickerVisible: false,
          mentionSearchValue: '',
        })
      }
    }

    getUserMentionedName(userId) {
      const mentionName = this.props.usersNicknames.get(userId)
      // TODO - refactor & unify with web message input
      // const isMentionNameUnique = isNicknameUnique(mentionName, this.props.usersNicknames)
      //
      // if (!isMentionNameUnique) {
      //   mentionName = this.props.usersEmails.get(userId)
      // }

      return mentionName
    }

    onMentionUser(userId) {
      const mentionedName = this.getUserMentionedName(userId)

      const textWithMention = getTextWithMentionInserted(this.state.text, mentionedName, this.state.mentionStartPosition, this.state.mentionSearchValue)

      this.setState({
        text: textWithMention,
        isMentionPickerVisible: false,
      })

      return textWithMention
    }

    onHail(hail) {
      const textWithMention = getTextWithMentionInserted(this.state.text, hail, this.state.mentionStartPosition, this.state.mentionSearchValue)

      this.setState({
        text: textWithMention,
        isMentionPickerVisible: false,
      })

      return textWithMention
    }

  }

  function mapStateToProps(state, props) {
    const objectType = selectEntityType(state, { entityId: props.objectId })
    return {
      placeholder: objectType === EntityType.TASK_DATA
        ? 'Write a comment...'
        : `${selectChatMessagePlaceholder(state, { projectId: props.objectId })}`,

      usersNicknames: selectUsersNicknames(state),
      usersEmails: selectUsersEmail(state),
      color: objectType === EntityType.TASK_DATA
        ? selectTaskColor(state, { taskId: props.objectId })
        : selectProjectColor(state, { projectId: props.objectId })
    }
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onSendMessage: (messageContent, mentionedUserIds, hails) => dispatch(MessagesModelActions.onMessageSend(messageContent, props.objectId, mentionedUserIds, hails)),
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceNewMessageInput)
}

export default Enhance
