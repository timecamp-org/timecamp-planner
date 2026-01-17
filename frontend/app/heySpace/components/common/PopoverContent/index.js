import React from 'react';
import EnhanceWithClickOutside from 'react-click-outside';
import PureBaseComponent from 'commonEnhancers/PureBaseComponent';

@EnhanceWithClickOutside
export default class PopoverContent extends PureBaseComponent {
  render() {
    return this.props.children;
  }

  handleClickOutside(event) {
    if (
      this.props.isVisible &&
      this.popperRootNode &&
      !this.popperRootNode.contains(event.target)
    ) {
      this.props.onClickOutside(event);
    }
  }

  componentDidMount() {
    this.popperRootNode = document.getElementById('popper-root');
  }
}
