import React from "react";
import { connect } from "react-redux";
import BaseComponent from "commonEnhancers/BaseComponent";

import { onSetIsWorkspaceModalOpen } from "models/domain/AppModel/actions";

function Enhance(ComposedComponent) {
  class EnhanceWorkspaceSwitcherMenu extends BaseComponent {
    static propTypes = {};

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          switcherClassName={this.props.switcherClassName}
          onSetIsWorkspaceModalOpen={this.props.onSetIsWorkspaceModalOpen}
          onClick={this.props.onClick}
        />
      );
    }
  }

  function mapDispatchToProps(dispatch) {
    return {
      onSetIsWorkspaceModalOpen: (isOpen) =>
        dispatch(onSetIsWorkspaceModalOpen(isOpen)),
    };
  }

  return connect(null, mapDispatchToProps)(EnhanceWorkspaceSwitcherMenu);
}

export default Enhance;
