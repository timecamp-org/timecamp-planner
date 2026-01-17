import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";

export default function enhance(Component) {
  class EnhancedComponent extends BaseComponent {
    render() {
      return <Component {...this.props} />;
    }
  }

  function mapStateToProps(state, ownProps) {
    return {};
  }

  function mapDispatchToProps(dispatch, ownProps) {
    return {};
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhancedComponent);
}
