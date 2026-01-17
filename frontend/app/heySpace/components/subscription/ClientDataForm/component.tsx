import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import { doNothing } from 'common/utils';

import UserInput from 'commonComponents/UserInput';
import { useTranslation } from 'i18n';
import LocationInputs from 'components/subscription/LocationInputs';

ClientDataForm.propTypes = {
  className: PropTypes.string,

  nameHumanMessageModel: PropTypes.object,
  streetHumanMessageModel: PropTypes.object,
  cityHumanMessageModel: PropTypes.object,
  zipHumanMessageModel: PropTypes.object,

  onClientNameUpdate: PropTypes.func.isRequired,
  onClientStreetUpdate: PropTypes.func.isRequired,
  onClientCityUpdate: PropTypes.func.isRequired,
  onClientZipUpdate: PropTypes.func.isRequired,

  onValidateName: PropTypes.func.isRequired,
  onValidateCity: PropTypes.func.isRequired,
  onValidateStreet: PropTypes.func.isRequired,
  onValidateZip: PropTypes.func.isRequired,
};

ClientDataForm.defaultProps = {
  onClientNameUpdate: doNothing,
  onClientStreetUpdate: doNothing,
  onClientCityUpdate: doNothing,
  onClientZipUpdate: doNothing,
  onValidateName: doNothing,
  onValidateCity: doNothing,
  onValidateStreet: doNothing,
  onValidateZip: doNothing,
};

function ClientDataForm(props) {
  // eslint-disable-line react/prefer-stateless-function
  const { t } = useTranslation();
  return (
    <div className={props.className ? props.className : styles.Component}>
      <UserInput
        className={styles.input}
        label={t('Company name / your name: ')}
        shouldRenderRequiredStar
        required
        humanMessage={props.nameHumanMessageModel}
        onChange={props.onClientNameUpdate}
        onBlur={props.onValidateName}
      />
      <UserInput
        className={styles.input}
        label={t('Street: ')}
        shouldRenderRequiredStar
        required
        humanMessage={props.streetHumanMessageModel}
        onChange={props.onClientStreetUpdate}
        onBlur={props.onValidateStreet}
      />
      <div className={styles.cityContainer}>
        <UserInput
          className={styles.input}
          label={t('City: ')}
          shouldRenderRequiredStar
          required
          humanMessage={props.cityHumanMessageModel}
          onChange={props.onClientCityUpdate}
          onBlur={props.onValidateCity}
        />
      </div>
      <div className={styles.postalContainer}>
        <UserInput
          className={styles.input}
          label={t('Zip / postal code: ')}
          shouldRenderRequiredStar
          required
          humanMessage={props.zipHumanMessageModel}
          onChange={props.onClientZipUpdate}
          onBlur={props.onValidateZip}
        />
      </div>
      <LocationInputs />
    </div>
  );
}

export default ClientDataForm;
