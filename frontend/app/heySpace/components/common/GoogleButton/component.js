import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import BaseComponent from 'commonEnhancers/BaseComponent';
import { i18n } from 'i18n';

import Button from '../../buttons/Button';

import styles from './styles.css';

import GIcon from '-!svg-react-loader?name=GIcon!./g-icon.svg';
import GIconGrey from '-!svg-react-loader?name=GIconGrey!./g-icon-grey.svg';

class GoogleButton extends BaseComponent {
  static propTypes = {
    className: PropTypes.string,

    buttonText: PropTypes.string,
    isDisabled: PropTypes.bool,

    onClick: PropTypes.func,
  };

  static defaultProps = {
    className: undefined,

    buttonText: i18n.t('Login with Google'),
    isDisabled: false,

    onClick: doNothing,
  };

  render() {
    return (
      <Button
        type="button"
        className={`
          ${this.props.className || styles.Component}
          ${this.props.isDisabled ? styles.disabled : undefined}
        `}
        isDisabled={this.props.isDisabled}
        onClick={this.props.onClick}
      >
        {this.props.isDisabled ? <GIconGrey className={styles.icon} /> : <GIcon className={styles.icon} />}

        <div className={styles.text}>{this.props.buttonText}</div>
      </Button>
    );
  }
}

export default GoogleButton;
