import React from 'react';
import PropTypes from 'prop-types';
import showInfoTooltipDelay from 'common/utils/showInfoTooltipDelay';
import { doNothing } from 'common/utils';

import BaseComponent from 'commonEnhancers/BaseComponent';

function enhance(ComposedComponent) {
  class EnhanceFollowObjectController extends BaseComponent {
    static propTypes = {
      isDisabled: PropTypes.bool,
    };

    static defaultProps = {
      isDisabled: false,
    };

    state = {
      shouldRenderInfoTooltip: false,
    };

    render() {
      return (
        <ComposedComponent
          {...this.props}
          onClick={this.props.isDisabled ? doNothing : this.props.onClick}
          shouldRenderInfoTooltip={this.state.shouldRenderInfoTooltip}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        />
      );
    }

    onMouseEnter() {
      this.showTooltipTimeout = setTimeout(
        () =>
          this.setState({
            shouldRenderInfoTooltip: true,
          }),
        showInfoTooltipDelay
      );
    }

    onMouseLeave() {
      if (this.showTooltipTimeout) {
        clearTimeout(this.showTooltipTimeout);
      }

      this.setState({
        shouldRenderInfoTooltip: false,
      });
    }

    componentWillUnmount() {
      if (this.showTooltipTimeout) {
        clearTimeout(this.showTooltipTimeout);
      }
    }
  }

  return EnhanceFollowObjectController;
}

export default enhance;
