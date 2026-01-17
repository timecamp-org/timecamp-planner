import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { tagsColors } from "commonStyles/colors";

import { selectTagColorById } from "models/domain/TagsModel/selectors";
import { onUpdateTagColor } from "models/domain/TagsModel/actions";
import { selectHasAccessToTags } from "models/domain/SubscriptionLimitsModel/selectors";

import BaseComponent from "commonEnhancers/BaseComponent";
import EnhanceWithClickOutside from "react-click-outside";

function enhance(ComposedComponent) {
  @EnhanceWithClickOutside
  class EnhanceEditTagColor extends BaseComponent {
    static propTypes = {
      tagId: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      hasAccessToTags: PropTypes.bool.isRequired,
      onUpdateTagColor: PropTypes.func.isRequired,
    };

    state = {
      isPopoverOpened: false,
      isMouseOverButton: false,
    };

    render() {
      return (
        <ComposedComponent
          tagColor={this.props.color}
          availableTagColors={tagsColors}
          isMouseOverButton={this.state.isMouseOverButton}
          isPopoverOpened={this.state.isPopoverOpened}
          onMouseEnterButton={this.onMouseEnterButton}
          onMouseLeaveButton={this.onMouseLeaveButton}
          onChangeTagColor={this.onChangeTagColor}
          onIconClick={this.onToggleIsPopoverOpened}
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

    componentDidMount() {
      this.popperRootNode = document.getElementById("popper-root");
    }

    onChangeTagColor(color) {
      if (this.props.hasAccessToTags) {
        this.props.onUpdateTagColor(color);
      }
    }

    onToggleIsPopoverOpened() {
      if (this.props.hasAccessToTags) {
        this.setState((prevState) => ({
          isPopoverOpened: !prevState.isPopoverOpened,
        }));
      }
    }

    handleClickOutside(event) {
      if (
        this.state.isPopoverOpened &&
        !this.popperRootNode.contains(event.target)
      ) {
        this.setState({
          updatedColor: this.props.color,
          isPopoverOpened: false,
        });
      }
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      color: selectTagColorById(state, { tagId: props.tagId }),
      hasAccessToTags: selectHasAccessToTags(state),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onUpdateTagColor: (name) => dispatch(onUpdateTagColor(props.tagId, name)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceEditTagColor);
}

export default enhance;
