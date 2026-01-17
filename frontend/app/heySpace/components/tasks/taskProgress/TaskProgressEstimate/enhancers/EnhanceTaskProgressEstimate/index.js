import React from 'react';
import PropTypes from 'prop-types';

import showInfoTooltipDelay from 'common/utils/showInfoTooltipDelay';

import BaseComponent from 'commonEnhancers/BaseComponent';

function enhance(ComposedComponent) {
  class EnhanceTaskProgressEstimate extends BaseComponent {
    static propTypes = {
      // needs
      shouldRenderTooltip: PropTypes.bool,
    };

    static defaultProps = {
      shouldRenderTooltip: true,
    };

    state = {
      shouldRenderInfoTooltip: false,
    };

    showTooltipTimeout = null;

    render() {
      return (
        <ComposedComponent
          {...this.props}
          shouldRenderInfoTooltip={this.getShouldRenderInfoTooltip()}
          onMouseEnterProgressBar={this.onMouseEnterProgressBar}
          onMouseLeaveProgressBar={this.onMouseLeaveProgressBar}
        />
      );
    }

    onMouseEnterProgressBar() {
      this.showTooltipTimeout = setTimeout(
        () =>
          this.setState({
            shouldRenderInfoTooltip: true,
          }),
        showInfoTooltipDelay
      );
    }

    onMouseLeaveProgressBar() {
      if (this.showTooltipTimeout) {
        clearTimeout(this.showTooltipTimeout);
      }

      this.setState({
        shouldRenderInfoTooltip: false,
      });
    }

    getShouldRenderInfoTooltip() {
      return (
        this.state.shouldRenderInfoTooltip && !this.state.isAssigneePickerOpen
      );
    }

    componentWillUnmount() {
      if (this.showTooltipTimeout) {
        clearTimeout(this.showTooltipTimeout);
      }
    }
  }

  return EnhanceTaskProgressEstimate;
}

export default enhance;
