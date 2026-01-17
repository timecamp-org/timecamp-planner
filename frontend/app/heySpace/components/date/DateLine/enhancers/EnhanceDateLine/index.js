import React from 'react';
import PropTypes from 'prop-types';

import PureBaseComponent from 'commonEnhancers/PureBaseComponent';
import { doNothing } from 'common/utils';

function Enhance(ComposedComponent) {
  class EnhanceDateLine extends PureBaseComponent {
    static propTypes = {
      id: PropTypes.string,

      innerRef: PropTypes.func.isRequired,
    };

    static defaultProps = {
      innerRef: doNothing,
    };

    render() {
      return (
        <ComposedComponent
          timestamp={this.props.timestamp}
          shouldRenderTopBackground={this.props.shouldRenderTopBackground}
          innerRef={this.innerRef}
        />
      );
    }

    innerRef(ref) {
      this.props.innerRef(ref, this.props.id);
    }
  }

  return EnhanceDateLine;
}

export default Enhance;
