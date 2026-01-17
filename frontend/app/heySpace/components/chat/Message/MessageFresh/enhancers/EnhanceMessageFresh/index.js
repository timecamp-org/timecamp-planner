import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import colorStyles from 'styles/colors.css';

import { selectMessageAttachmentsIds } from 'models/domain/MessagesModel/selectors';

import {
  selectMessageUser,
  selectMessageText,
  selectMessageEditorId,
  selectMessageCreatedAt,
  selectMessageContainerId,
} from 'models/domain/MessagesModel/selectors/domain';

import { selectRequestIsFailure } from 'models/domain/RequestModel/selectors';
import { sendMessage } from 'models/domain/RequestModel/constants/requestTypes';

import { selectTaskIdFromMessageId } from 'models/domain/TasksModel/selectors';
import { selectMessageReactions } from 'models/domain/MessagesModel/selectors/domain';

import BaseComponent from 'commonEnhancers/BaseComponent';

function Enhance(ComposedComponent) {
  class EnhanceMessageFresh extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      messageId: PropTypes.string.isRequired,
      objectId: PropTypes.string.isRequired,
      color: PropTypes.string,
    };

    static defaultProps = {
      color: colorStyles.wisteriaColor,
    };

    render() {
      return (
        <ComposedComponent
          messageId={this.props.messageId}
          className={this.props.className}
          text={this.props.text}
          color={this.props.color}
          editorId={this.props.editorId}
          userId={this.props.userId}
          dateAdded={this.props.dateAdded}
          attachmentsIds={this.props.attachmentsIds}
          hasMessageError={this.props.hasMessageError}
          isMessageHovered={this.props.isMessageHovered}
          objectId={this.props.objectId}
          taskIdFromMessage={this.props.taskIdFromMessage}
          messageReactions={this.props.messageReactions}
        />
      );
    }
  }

  const mapStateToProps = (state, props) => {
    const taskIdFromMessage = selectTaskIdFromMessageId(state, {
      messageId: props.messageId,
    });

    return {
      text: selectMessageText(state, { messageId: props.messageId }),
      editorId: selectMessageEditorId(state, { messageId: props.messageId }),
      dateAdded: selectMessageCreatedAt(state, { messageId: props.messageId }),
      attachmentsIds: selectMessageAttachmentsIds(state, {
        messageId: props.messageId,
      }),
      hasMessageError: selectRequestIsFailure(state, {
        objectId: props.messageId,
        requestType: sendMessage,
      }),
      userId: selectMessageUser(state, { messageId: props.messageId }),
      objectId: selectMessageContainerId(state, { messageId: props.messageId }),
      taskIdFromMessage,
      messageReactions: selectMessageReactions(state, {
        messageId: props.messageId,
      }),
    };
  };

  return connect(mapStateToProps)(EnhanceMessageFresh);
}

export default Enhance;
