import React from 'react';

import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import { format } from 'common/utils/dateOperations';
import BaseComponent from 'commonEnhancers/BaseComponent';

import styles from './styles.css';

class DateOutput extends BaseComponent {
  static propTypes = {
    className: PropTypes.string,

    timestamp: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    format: PropTypes.string.isRequired,
    tabIndex: PropTypes.number,

    leftText: PropTypes.string, // TODO what is that for?
    rightText: PropTypes.string, // TODO what is that for?

    onClick: PropTypes.func,
  };

  static defaultProps = {
    className: undefined,

    leftTextClassName: undefined,
    rightTextClassName: undefined,

    leftText: '',
    rightText: '',
    tabIndex: undefined,

    onClick: doNothing,
  };

  render() {
    return (
      <span
        className={`${this.props.className}`}
        onClick={this.props.onClick}
        tabIndex={this.props.tabIndex}
      >
        <span className={this.props.leftTextClassName}>
          {this.props.leftText}
        </span>
        {this.props.timestamp ? (
          format(this.props.timestamp, this.props.format)
        ) : (
          <span className={styles.placeholder}>{this.props.placeholder}</span>
        )}
        <span className={this.props.rightTextClassName}>
          {this.props.rightText}
        </span>
      </span>
    );
  }
}

export default DateOutput;
