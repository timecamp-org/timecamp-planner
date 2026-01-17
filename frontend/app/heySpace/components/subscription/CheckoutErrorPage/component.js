import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
// import Mascot from 'commonComponents/Mascot/assets/character_21.png';
import { useTranslation } from 'i18n';

import styles from './styles.css';

CheckoutErrorPage.propTypes = {
  onGoToSettings: PropTypes.func,
};

CheckoutErrorPage.defaultProps = {
  onGoToSettings: doNothing,
};

function CheckoutErrorPage(props) {
  const { t } = useTranslation();

  return (
    <div className={styles.Component}>
      <div className={styles.summaryWrapper}>
        <div className={styles.header}>{t(`Ups... \n Something went wrong!`)}</div>
        {/* <img src={Mascot} className={styles.mascot} /> */}
        <div className={styles.message}>
          <div className={styles.boldedText}>{t('Don’t worry it’s just a small glitch.')}</div>
          <div className={styles.smallText}>
            {t(
              'The issue is on our side - we’re sorry! \n Please contact us and we will manually push your payment through our system.'
            )}
          </div>
        </div>
        <div className={styles.contactWrapper}>
          <div className={styles.smallText}>{t(`Contact:   `)}</div>
          <a className={styles.mailto} href="mailto:planner@timecamp.com">{`planner@timecamp.com`}</a>
        </div>
      </div>
      <div className={styles.footer}>
        {t('Go back to the')}{' '}
        <span className={styles.link} onClick={props.onGoToSettings}>
          {t('Subscription settings')}
        </span>
      </div>
    </div>
  );
}

export default CheckoutErrorPage;
