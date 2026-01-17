import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';

import BaseComponent from 'commonEnhancers/BaseComponent';
import { Tick } from 'commonComponents/Icons';

class ProjectColorDot extends BaseComponent {
  static propTypes = {
    className: PropTypes.string,
    innerClassName: PropTypes.string,
    shouldRenderInnerRing: PropTypes.bool,
    shouldRenderTick: PropTypes.bool,
    // @EnhanceProjectColor
    projectColor: PropTypes.string,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    shouldRenderInnerRing: true,
    shouldRenderTick: false,
    disabled: false,
  };

  render() {
    return (
      <div
        className={`${
          this.props.className ? this.props.className : styles.ring
        }`}
        style={this.getDotColorStyle()}
      >
        {this.props.shouldRenderInnerRing ? this.renderInnerRing() : null}
        {this.props.shouldRenderTick ? <Tick className={styles.tick} /> : null}
      </div>
    );
  }

  renderInnerRing() {
    return (
      <div
        className={`${
          this.props.innerClassName
            ? this.props.innerClassName
            : styles.innerRing
        } ${this.props.disabled ? styles.disabled : ''}`}
      />
    );
  }

  getDotColorStyle() {
    return {
      backgroundColor: this.props.projectColor || '#6ccecf',
    };
  }
}

export default ProjectColorDot;
