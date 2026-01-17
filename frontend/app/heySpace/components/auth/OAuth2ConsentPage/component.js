import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { doNothing } from 'common/utils';

import PrimaryButton from 'components/buttons/PrimaryButton';
import SecondaryButton from 'components/buttons/SecondaryButton';
import SignInForm from 'components/auth/signIn/SignInForm';
import NotFoundPage from 'components/pages/NotFoundPage';
import ProgressiveImage from 'react-progressive-image';
import BrandLogo from 'commonComponents/BrandLogo';
import { useTranslation } from 'i18n';

import styles from './styles.css';

OAuth2ConsentPage.propTypes = {
  className: PropTypes.string,
  clientName: PropTypes.string,
  clientThumbnailUrl: PropTypes.string,
  fullName: PropTypes.string,
  isCurrentUserAuthenticated: PropTypes.bool,
  isValidRequestParams: PropTypes.bool,
  permissions: PropTypes.array,

  onAuthorize: PropTypes.func,
  onDeny: PropTypes.func,
  onSignOut: PropTypes.func,
};

OAuth2ConsentPage.defaultProps = {
  className: '',
  clientName: '',
  clientThumbnailUrl: '',
  fullName: '',
  isCurrentUserAuthenticated: false,
  isValidRequestParams: false,
  permissions: [],

  onAuthorize: doNothing,
  onDeny: doNothing,
  onSignOut: doNothing,
};

function OAuth2ConsentPage(props) {
  const { t } = useTranslation();
  if (!props.isValidRequestParams) {
    return <NotFoundPage />;
  }

  return (
    <div className={props.className || styles.Component}>
      <div className={styles.authorizePage}>
        <BrandLogo className={styles.brandLogo} />
        {props.isCurrentUserAuthenticated ? renderAuthorization() : <SignInForm className={styles.signInForm} />}
      </div>
    </div>
  );

  function renderAuthorization() {
    return (
      <Fragment>
        <div className={styles.header}>{t('Grant Permission')}</div>
        <div className={styles.subHeader}>
          {props.clientThumbnailUrl ? renderClientThumbnail() : null}
          {t(`{{clientName}} is requiring permission to use your Planner account.`, { clientName: props.clientName })}
        </div>
        <div className={styles.hint}>{t('By allowing access you give this app the permission to:')}</div>
        <ul className={styles.permissions}>{props.permissions.map(renderPermission)}</ul>
        <div className={styles.buttons}>
          <SecondaryButton className={styles.denyButton} onClick={props.onDeny}>
            {t('Deny')}
          </SecondaryButton>
          <PrimaryButton className={styles.authorizeButton} onClick={props.onAuthorize}>
            {t('Allow')}
          </PrimaryButton>
        </div>
        <div className={styles.relogHint}>
          {t(`Logged in as {{fullName}}`, { fullName: props.fullName })}
          {' ('}
          <span className={styles.logoutLink} onClick={props.onSignOut}>
            {t('Not you?')}
          </span>
          {')'}
        </div>
      </Fragment>
    );
  }

  function renderPermission(permission) {
    return (
      <li key={permission} className={styles.permission}>
        {permission}
      </li>
    );
  }

  function renderClientThumbnail() {
    return (
      <ProgressiveImage src={props.clientThumbnailUrl}>
        {(src, loading) => renderImage(loading, src, props.onClick)}
      </ProgressiveImage>
    );
  }

  function renderImage(loading, src) {
    return loading ? <div className={styles.imagePlaceholder}></div> : <img src={src} className={styles.image} />;
  }
}

export default OAuth2ConsentPage;
