import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { onDeleteTag } from "models/domain/TagsModel/actions";
import { selectHasAccessToTags } from "models/domain/SubscriptionLimitsModel/selectors";

import BaseComponent from "commonEnhancers/BaseComponent";

function enhance(ComposedComponent) {
  class EnhanceDeleteTag extends BaseComponent {
    static propTypes = {
      tagId: PropTypes.string.isRequired,
      hasAccessToTags: PropTypes.bool.isRequired,
      onDeleteTag: PropTypes.func.isRequired,
    };

    state = {
      isModalOpened: false,
      isMouseOverButton: false,
    };

    render() {
      return (
        <ComposedComponent
          isModalOpened={this.state.isModalOpened}
          isMouseOverButton={this.state.isMouseOverButton}
          onMouseEnterButton={this.onMouseEnterButton}
          onMouseLeaveButton={this.onMouseLeaveButton}
          onOpenModal={this.onOpenModal}
          onCloseModal={this.onCloseModal}
          onDeleteTag={this.props.onDeleteTag}
        />
      );
    }

    onMouseEnterButton() {
      if (!this.props.hasAccessToTags) {
        this.setState({
          isMouseOverButton: true,
        });
      }
    }

    onMouseLeaveButton() {
      if (!this.props.hasAccessToTags) {
        this.setState({
          isMouseOverButton: false,
        });
      }
    }

    onOpenModal() {
      if (this.props.hasAccessToTags) {
        this.setState({
          isModalOpened: true,
        });
      }
    }

    onCloseModal() {
      this.setState({
        isModalOpened: false,
      });
    }
  }

  const mapStateToProps = (state, props) => ({
    hasAccessToTags: selectHasAccessToTags(state),
  });

  const mapDispatchToProps = (dispatch, props) => ({
    onDeleteTag: () => dispatch(onDeleteTag(props.tagId)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceDeleteTag);
}

export default enhance;
