import { List } from 'immutable';
import ImmutablePropTypes from 'immutable-prop-types';
import PropTypes from 'prop-types';

import { useTranslation } from 'i18n';

import styles from './styles.css';

SubscriptionFeatures.propTypes = {
  className: PropTypes.string,
  features: ImmutablePropTypes.list.isRequired,
  featuresAdditional: ImmutablePropTypes.list.isRequired,
  header: PropTypes.string,
};

SubscriptionFeatures.defaultProps = {
  features: new List(),
  featuresAdditional: new List(),
  header: '',
};

function SubscriptionFeatures(props) {
  const { t } = useTranslation();

  return (
    <div className={props.className ? props.className : styles.Component}>
      <div className={styles.header}>{props.header}</div>
      <div className={styles.featureList}>
        {props.features.map(renderFeature)}
        {props.featuresAdditional.size > 0 ? '+' : null}
        {props.featuresAdditional.map(renderFeature)}
      </div>
    </div>
  );

  function renderFeature(feature, index) {
    return (
      <div className={styles.feature} key={index}>
        {t(feature)}
      </div>
    );
  }
}

export default SubscriptionFeatures;
