import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { selectTagNameById } from "models/domain/TagsModel/selectors";
import { onUpdateTagName } from "models/domain/TagsModel/actions";
import { selectHasAccessToTags } from "models/domain/SubscriptionLimitsModel/selectors";

import BaseComponent from "commonEnhancers/BaseComponent";
import EnhanceWithClickOutside from "react-click-outside";

function enhance(ComposedComponent) {
  @EnhanceWithClickOutside
  class EnhanceEditTagName extends BaseComponent {
    static propTypes = {
      tagId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      hasAccessToTags: PropTypes.bool.isRequired,
      onUpdateTagName: PropTypes.func.isRequired,
    };

    state = {
      updatedName: this.props.name,
      isPopoverOpened: false,
      isMouseOverButton: false,
    };

    render() {
      return (
        <ComposedComponent
          tagName={this.state.updatedName}
          isMouseOverButton={this.state.isMouseOverButton}
          isPopoverOpened={this.state.isPopoverOpened}
          onMouseEnterButton={this.onMouseEnterButton}
          onMouseLeaveButton={this.onMouseLeaveButton}
          onChangeTagName={this.onChangeTagName}
          onIconClick={this.onToggleIsPopoverOpened}
          onUpdateTagName={this.onUpdateTagName}
          onClosePopover={this.onClosePopover}
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

    onChangeTagName(event) {
      this.setState({
        updatedName: event.target.value,
      });
    }

    onUpdateTagName() {
      if (this.props.hasAccessToTags) {
        this.props.onUpdateTagName(this.state.updatedName);
        this.onClosePopover();
      }
    }

    onToggleIsPopoverOpened() {
      if (this.props.hasAccessToTags) {
        this.setState((prevState) => ({
          isPopoverOpened: !prevState.isPopoverOpened,
        }));
      }
    }

    onClosePopover() {
      this.setState({
        updatedName: this.props.name,
        isPopoverOpened: false,
      });
    }

    handleClickOutside(event) {
      if (
        this.state.isPopoverOpened &&
        !this.popperRootNode.contains(event.target)
      ) {
        this.setState({
          updatedName: this.props.name,
          isPopoverOpened: false,
        });
      }
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      name: selectTagNameById(state, { tagId: props.tagId }),
      hasAccessToTags: selectHasAccessToTags(state),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onUpdateTagName: (name) => dispatch(onUpdateTagName(props.tagId, name)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceEditTagName);
}

export default enhance;
