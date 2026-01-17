import React from "react";
import PropTypes from "prop-types";
import styles from "./styles.css";
import { doNothing } from "common/utils";

import BaseComponent from "commonEnhancers/BaseComponent";
import LoginOfflineMessage from 'components/auth/signIn/LoginOfflineMessage';

class OfflinePageWithRetryButton extends BaseComponent {
  // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    isLoading: PropTypes.bool,
    loadingType: PropTypes.oneOf([
      "signIn",
      "signUp",
      "forgottenPassword",
      "changePassword",
    ]),

    onRetry: PropTypes.func,
  };

  static defaultProps = {
    onRetry: doNothing,
  };

  render() {
    return (
      <div className={styles.Component}>
        <div className={styles.content}>
          <LoginOfflineMessage onRetry={this.props.onRetry} />
        </div>
      </div>
    );
  }
}

export default OfflinePageWithRetryButton;
