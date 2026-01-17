import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import { connect } from "react-redux";
import {
  selectRequestIsLoading,
  selectRequestIsFailure,
} from "models/domain/RequestModel/selectors";
import { sendMessage } from "models/domain/RequestModel/constants/requestTypes";
import { doNothing } from "common/utils";

import {
  selectDoesMessageBelongToCurrentUser,
  selectMessageAttachmentsIds,
} from "models/domain/MessagesModel/selectors";
import { selectEntityType } from "models/domain/EntityModel/selectors";
import {
  selectMessageUser,
  selectMessageContainerId,
  selectIsMessageBeingEdited,
  selectMessageIsContinuation,
} from "models/domain/MessagesModel/selectors/domain";
import { selectProjectColor } from "models/domain/ProjectsModel/selectors";
import { selectTaskColor } from "models/domain/TasksModel/selectors";
import { selectUsersThatReadMessage } from "models/domain/MessagesModel/selectors";

import BaseComponent from "commonEnhancers/BaseComponent";
import { EntityType } from "models/domain/EntityModel/types";

function Enhance(ComposedComponent) {
  class EnhanceMessage extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      color: PropTypes.string,
      messageId: PropTypes.string.isRequired,
      objectId: PropTypes.string.isRequired,

      attachmentsIds: ImmutablePropTypes.list.isRequired,
      isContinuation: PropTypes.bool.isRequired,
      isBeingEdited: PropTypes.bool.isRequired,
      isMessageSending: PropTypes.bool.isRequired,
      isOwnMessage: PropTypes.bool.isRequired,
      hasMessageError: PropTypes.bool.isRequired,
    };

    static defaultProps = {
      isContinuation: false,
      isBeingEdited: false,
      innerRef: doNothing,
    };

    render() {
      return (
        <ComposedComponent
          innerRef={this.innerRef}
          color={this.props.color}
          messageId={this.props.messageId}
          attachmentsIds={this.props.attachmentsIds}
          hasMessageError={this.props.hasMessageError}
          objectId={this.props.objectId}
          usersThatReadMessageIds={this.props.usersThatReadMessageIds}
          isContinuation={this.props.isContinuation}
          isBeingEdited={this.props.isBeingEdited}
          isMessageSending={this.props.isMessageSending}
          isOwnMessage={this.props.isOwnMessage}
          focusNewMessageEditor={this.props.focusNewMessageEditor}
        />
      );
    }

    innerRef(ref) {
      this.props.innerRef(ref, this.props.messageId);
    }
  }

  const mapStateToProps = (state, props) => {
    const objectId = selectMessageContainerId(state, {
      messageId: props.messageId,
    });
    const entityType = selectEntityType(state, { entityId: props.objectId });
    let color = selectProjectColor(state, { projectId: props.objectId });
    if (entityType === EntityType.TASK_DATA) {
      color = selectTaskColor(state, { taskId: props.objectId });
    }
    return {
      isBeingEdited: selectIsMessageBeingEdited(state, {
        messageId: props.messageId,
      }),
      isMessageSending: selectRequestIsLoading(state, {
        objectId: props.messageId,
        requestType: sendMessage,
      }),
      hasMessageError: selectRequestIsFailure(state, {
        objectId: props.messageId,
        requestType: sendMessage,
      }),
      isOwnMessage: selectDoesMessageBelongToCurrentUser(state, {
        messageId: props.messageId,
      }),
      attachmentsIds: selectMessageAttachmentsIds(state, {
        messageId: props.messageId,
      }),
      userId: selectMessageUser(state, { messageId: props.messageId }),
      isContinuation: selectMessageIsContinuation(state, {
        messageId: props.messageId,
        objectId,
      }),
      objectId,
      color,
      usersThatReadMessageIds: selectUsersThatReadMessage(state, {
        messageId: props.messageId,
        objectId: props.objectId,
      }),
    };
  };

  return connect(mapStateToProps)(EnhanceMessage);
}

export default Enhance;
