import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BaseComponent from "commonEnhancers/BaseComponent";

import { onCreateUserApp } from "models/domain/UserAppsModel/actions";

function Enhance(ComposedComponent) {
  class EnhanceCreateAppModal extends BaseComponent {
    static propTypes = {};

    state = {
      clientName: "",
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          isModalVisible={this.props.isModalVisible}
          clientName={this.state.clientName}
          onSetIsModalOpen={this.onSetIsModalOpen}
          onUpdateClientName={this.onUpdateClientName}
          onCreateUserApp={this.onCreateUserApp}
          onKeyDown={this.onKeyDown}
        />
      );
    }

    onUpdateClientName(event) {
      const name = event.target.value;
      this.setState({ clientName: name });
    }

    onCreateUserApp() {
      this.props.onCreateUserApp(this.state.clientName);
      this.onSetIsModalOpen(false);
    }

    onSetIsModalOpen(isOpen) {
      if (!isOpen) {
        this.setState({ clientName: "" });
      }
      this.props.onSetIsModalOpen(isOpen);
    }

    onKeyDown(event) {
      if (event.key === "Enter") {
        this.onCreateUserApp();
      }
    }
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onCreateUserApp: (clientName) =>
        dispatch(onCreateUserApp({ clientName })),
    };
  }

  return connect(null, mapDispatchToProps)(EnhanceCreateAppModal);
}

export default Enhance;
