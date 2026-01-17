import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { selectProjectColor } from "models/domain/ProjectsModel/selectors";

import BaseComponent from "commonEnhancers/BaseComponent";

function Enhance(ComposedComponent) {
  class EnhanceRightPanelLabel extends BaseComponent {
    static propTypes = {
      objectId: PropTypes.string.isRequired,
      currentPanelName: PropTypes.string,
    };

    render() {
      return (
        <ComposedComponent
          currentPanelName={this.props.currentPanelName}
          color={this.props.color}
        />
      );
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      color: selectProjectColor(state, { projectId: props.objectId }),
    };
  };

  return connect(mapStateToProps)(EnhanceRightPanelLabel);
}

export default Enhance;
