import React from "react";
import PropTypes from "prop-types";

import { doNothing } from "common/utils";
import BaseComponent from "commonEnhancers/BaseComponent";

const pickerMargin = 20;

function Enhance(ComposedComponent) {
  class EnhanceEmojiPicker extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
      buttonClassName: PropTypes.string,
      onEmojiPick: PropTypes.func.isRequired,
      onEmojiPickerOpen: PropTypes.func.isRequired,
      isPickerOpen: PropTypes.bool,
    };

    static defaultProps = {
      onEmojiPick: doNothing,
      onEmojiPickerOpen: doNothing,
      onSetIsEmojPickerOpen: doNothing,
    };

    state = {
      isPickerOpen: false,
      modalOffsetX: 0,
      modalOffsetY: 0,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          buttonClassName={this.props.buttonClassName}
          buttonShadeClassName={this.props.buttonShadeClassName}
          color={this.props.color}
          iconComponent={this.props.iconComponent}
          buttonSize={this.props.buttonSize}
          isPickerOpen={this.isPickerOpen()}
          modalOffsetX={this.state.modalOffsetX}
          modalOffsetY={this.state.modalOffsetY}
          onSetIsEmojPickerOpen={this.onSetIsEmojPickerOpen}
          onEmojiPick={this.onEmojiPick}
          onSetModalRef={this.onSetModalRef}
          onSetButtonRef={this.onSetButtonRef}
          buttonRenderer={this.props.buttonRenderer}
        />
      );
    }

    isPickerOpen() {
      return (
        this.state.isPickerOpen &&
        (typeof this.props.isPickerOpen === "undefined" ||
          this.props.isPickerOpen)
      );
    }

    onEmojiPick(emoji) {
      this.props.onEmojiPick(emoji);
      this.onSetIsEmojPickerOpen(false);
    }

    onSetIsEmojPickerOpen(isPickerOpen) {
      this.setState({ isPickerOpen });
      this.props.onEmojiPickerOpen(isPickerOpen);
    }

    onSetModalRef(ref) {
      this.modalRef = ref;
    }

    onSetButtonRef(ref) {
      this.buttonRef = ref;
    }

    onRecalculateModalPosition() {
      if (this.modalRef && this.buttonRef) {
        const button = this.buttonRef.getBoundingClientRect();
        const modal = this.modalRef.getBoundingClientRect();

        let offsetRight = button.x - modal.width / 2;
        const offsetTop = button.y - modal.height;

        const maxOffsetRight = window.innerWidth - modal.width - pickerMargin;
        offsetRight = Math.min(maxOffsetRight, offsetRight);

        this.setState({
          modalOffsetX: offsetRight < 0 ? 0 : offsetRight,
          modalOffsetY: offsetTop < 0 ? 0 : offsetTop,
        });
      }
    }

    componentDidMount() {
      this.onRecalculateModalPosition();
    }

    componentDidUpdate(prevProps, prevState) {
      if (!prevState.isPickerOpen && this.state.isPickerOpen) {
        this.onRecalculateModalPosition();
      }
    }
  }

  return EnhanceEmojiPicker;
}

export default Enhance;
