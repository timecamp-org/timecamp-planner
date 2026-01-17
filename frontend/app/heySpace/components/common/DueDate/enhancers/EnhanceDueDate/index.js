import React from "react";
import PropTypes from "prop-types";

import BaseComponent from "commonEnhancers/BaseComponent";

function enhance(ComposedComponent) {
  class EnhanceDueDate extends BaseComponent {
    static propTypes = {
      dueDate: PropTypes.number,
      isLate: PropTypes.bool,
    };

    render() {
      if (this.props.dueDate) {
        return (
          <ComposedComponent
            className={this.props.className}
            format={this.props.format}
            dueDate={this.props.dueDate}
            isColorsHidden={this.props.isColorsHidden}
            color={this.props.color}
            onClick={this.props.onClick}
          />
        );
      } else {
        return null;
      }
    }
  }

  return EnhanceDueDate;
}

export default enhance;
