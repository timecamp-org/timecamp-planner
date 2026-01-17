import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import { doNothing } from 'common/utils';

import BaseComponent from 'commonEnhancers/BaseComponent';

import Alert from 'components/alerts/Alert';
import PrimaryButton from 'components/buttons/PrimaryButton';
import { i18mark, i18n } from 'i18n';

class SubmitButton extends BaseComponent {
  static propTypes = {
    className: PropTypes.string,
    innerClassName: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.oneOf(['button', 'submit']),
    isDisabled: PropTypes.bool,
    shouldFocusOnMount: PropTypes.bool,
    humanMessageModel: PropTypes.object,
    isStyleHollow: PropTypes.bool,

    onClick: PropTypes.func,
    onBlur: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    innerClassName: '',
    name: i18mark('Submit'),
    type: 'button',
    isDisabled: false,
    shouldFocusOnMount: false,
    humanMessageModel: null,
    isStyleHollow: false,

    onClick: doNothing,
    onBlur: doNothing,
  };

  render() {
    return (
      <div className={this.props.className}>
        {this.renderButton()}
        {this.props.humanMessageModel ? this.renderAlert() : null}
      </div>
    );
  }

  renderButton() {
    return (
      <PrimaryButton
        className={this.props.innerClassName}
        innerRef={(button) => (this.button = button)}
        type={this.props.type}
        isDisabled={this.props.isDisabled}
        onClick={this.onClick}
      >
        {i18n.t(this.props.name)}
      </PrimaryButton>
    );
  }

  renderAlert() {
    return (
      <Alert className={styles.alert} model={this.props.humanMessageModel} />
    );
  }

  onClick() {
    if (!this.props.isDisabled) {
      this.props.onClick();
    }
  }

  componentDidMount() {
    if (this.props.shouldFocusOnMount) {
      this.button.focus();
    }
  }
}

export default SubmitButton;
