import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { selectHasAccessToTags } from "models/domain/SubscriptionLimitsModel/selectors";

import BaseComponent from "commonEnhancers/BaseComponent";

function Enhance(ComposedComponent) {
  class EnhanceCardTagsSection extends BaseComponent {
    state = {
      isHoveringNoAccessWrapper: false,
    };

    render() {
      return (
        <ComposedComponent
          taskId={this.props.taskId}
          color={this.props.color}
          isFocused={this.props.isFocused}
          hasAccessToTags={this.props.hasAccessToTags}
          isHoveringNoAccessWrapper={this.state.isHoveringNoAccessWrapper}
          onSetIsHoveringNoAccessWrapper={this.onSetIsHoveringNoAccessWrapper}
          onSetIsFocused={this.props.onSetIsFocused}
          onClick={this.props.onClick}
        />
      );
    }

    onSetIsHoveringNoAccessWrapper(isHoveringNoAccessWrapper) {
      this.setState({
        isHoveringNoAccessWrapper,
      });
    }
  }

  const mapStateToProps = (state) => {
    return {
      hasAccessToTags: selectHasAccessToTags(state),
    };
  };

  return connect(mapStateToProps)(EnhanceCardTagsSection);
}

export default Enhance;
