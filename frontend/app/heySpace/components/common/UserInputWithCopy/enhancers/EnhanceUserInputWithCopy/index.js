import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BaseComponent from "commonEnhancers/BaseComponent";
import { HumanMessage } from 'models/domain/HumanMessageModel/models'
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types'
import { onAddAlert } from "models/component/PopUpAlertsModel/actions";

function Enhance(ComposedComponent) {
  class EnhanceUserInputWithCopy extends BaseComponent {
    static propTypes = {};

    render() {
      return (
        <ComposedComponent
          {...this.props}
          onSetRef={this.onSetRef}
          onClick={this.onClick}
        />
      );
    }

    onSetRef(ref) {
      this.inputRef = ref;
    }

    onClick() {
      if (this.inputRef) {
        this.inputRef.select();
        document.execCommand("copy");
        this.props.onAddAlert("Copied!");
      }
    }
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onAddAlert: (message) => dispatch(onAddAlert({
        humanMessage: HumanMessage({
          kind: HumanMessageKind.success,
          text: message,
        }),
      })),
    }
  }

  return connect(null, mapDispatchToProps)(EnhanceUserInputWithCopy);
}

export default Enhance;
