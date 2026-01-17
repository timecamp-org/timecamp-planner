import React from 'react';

import PropTypes from 'prop-types';

import handleError from 'common/utils/handleError';
import BaseComponent from 'commonEnhancers/BaseComponent';
import PrimaryButton from 'components/buttons/PrimaryButton';
import { i18n } from 'i18n';

import styles from './styles.css';

class GlobalErrorBoundary extends BaseComponent {

  static propTypes = {
    appHasError: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    appHasError: false,
  };

  state = {
    hasError: false,
  };

  render() {
    if (this.state.hasError || this.props.appHasError) {
      return this.renderFallbackComponent();
    } else {
      return this.props.children;
    }
  }

  renderFallbackComponent() {
    return (
      <div className={styles.component}>
        <div className={styles.top}>
          <div className={styles.background}>{'500'}</div>
          <div className={styles.mascot} />
        </div>
        <div className={styles.title}>
          {i18n.t(`Houston, we have a problem!`)}
        </div>
        <div className={styles.description}>
          {i18n.t(`Sorry, the page you are looking for is temporaily not available. Our team is working on it. 
Meanwile take a tour through our website.`)}
        </div>
        <PrimaryButton onClick={this.reloadApp}>
          {i18n.t('Go to main page')}
        </PrimaryButton>
      </div>
    );
  }

  reloadApp() {
    window.location.replace('/');
  }

  componentDidCatch(error, componentStackTrace) {
    this.setState({
      hasError: true,
    });
    handleError(error, { extra: componentStackTrace });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.hasError && this.state.hasError) {
      const appLoadedEvent = new Event('appLoaded');
      document.dispatchEvent(appLoadedEvent);
    }
  }

}

export default GlobalErrorBoundary;
