import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";

import { onCreateMessagesWithFiles } from "models/domain/MessagesModel/actions";
import { selectTaskColor } from "models/domain/TasksModel/selectors";
import { selectRespondedMessageIdForObject } from "models/domain/MessagesModel/selectors";

function Enhance(ComposedComponent) {
  class EnhanceCardDetailsMessageBoard extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      objectId: PropTypes.string.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          objectId={this.props.objectId}
          color={this.props.color}
          respondedMessageId={this.props.respondedMessageId}
          onUploadFiles={this.props.onCreateMessagesWithFiles}
        />
      );
    }
  }

  function mapStateToProps(state, props) {
    return {
      color: selectTaskColor(state, { taskId: props.objectId }),
      respondedMessageId: selectRespondedMessageIdForObject(state, {
        objectId: props.objectId,
      }),
    };
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onCreateMessagesWithFiles: (files) =>
        dispatch(onCreateMessagesWithFiles(files, props.objectId)),
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceCardDetailsMessageBoard);
}

export default Enhance;
