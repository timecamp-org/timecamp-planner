import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { selectExtensionIdsByType } from "models/domain/ExtensionsModel/selectors/domain";

import BaseComponent from "commonEnhancers/BaseComponent";

export default function enhance(Component) {
  class EnhanceExtensionList extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
      type: PropTypes.string.isRequired,
    };

    render() {
      return (
        <Component
          className={this.props.className}
          extensionIds={this.props.extensionIds}
        />
      );
    }
  }

  const mapStateToProps = (state, props) => ({
    extensionIds: selectExtensionIdsByType(state, { type: props.type }),
  });

  return connect(mapStateToProps)(EnhanceExtensionList);
}
