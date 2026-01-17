import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";

import { selectOpenedCardDetailsModalId } from "models/domain/AppModel/selectors";
import { onCreateMessagesWithFiles } from "models/domain/MessagesModel/actions";
import { selectProjectColor } from "models/domain/ProjectsModel/selectors";
import { selectRespondedMessageIdForObject } from "models/domain/MessagesModel/selectors";

function Enhance(ComposedComponent) {
  class EnhanceMessageBoard extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      objectId: PropTypes.string.isRequired,
      className: PropTypes.string,
      objectType: PropTypes.string.isRequired,
      shouldFocusOnMount: PropTypes.bool,
    };

    static defaultProps = {
      shouldFocusOnMount: true,
    };

    render() {
      return (
        <ComposedComponent
          objectId={this.props.objectId}
          className={this.props.className}
          objectType={this.props.objectType}
          isCardDetailsModalOpened={
            this.props.openedCardDetailsModalId !== null
          }
          color={this.props.color}
          respondedMessageId={this.props.respondedMessageId}
          shouldFocusOnMount={this.props.shouldFocusOnMount}
          onUploadFiles={this.props.onCreateMessagesWithFiles}
        />
      );
    }
  }

  function mapStateToProps(state, props) {
    return {
      openedCardDetailsModalId: selectOpenedCardDetailsModalId(state),
      color: selectProjectColor(state, { projectId: props.objectId }),
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

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceMessageBoard);
}

export default Enhance;
