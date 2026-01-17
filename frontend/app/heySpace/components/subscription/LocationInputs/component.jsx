import { Fragment } from 'react';

import { List, Map } from 'immutable';
import ImmutablePropTypes from 'immutable-prop-types';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import Dropdown from 'commonComponents/Dropdown';
import { ChevronDown } from 'commonComponents/Icons/fontawesome/ChevronDown';
import { ChevronUp } from 'commonComponents/Icons/fontawesome/ChevronUp';
import UserInput from 'commonComponents/UserInput';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { useTranslation } from 'i18n';
import { countryKeysList, countryNamesMap } from 'models/domain/SubscriptionModel/countries';

import styles from './styles.css';

const emptyMap = new Map();
const emptyList = new List();

LocationInputs.propTypes = {
  country: PropTypes.string,
  province: PropTypes.string,
  countryStatesList: ImmutablePropTypes.list.isRequired,
  countryStatesMap: ImmutablePropTypes.map.isRequired,
  chosenCountry: PropTypes.object.isRequired,
  provinceHumanMessageModel: PropTypes.object,
  countryHumanMessageModel: PropTypes.object,

  onClientCountryUpdate: PropTypes.func.isRequired,
  onClientProvinceUpdate: PropTypes.func.isRequired,
  onValidateProvince: PropTypes.func.isRequired,
};

LocationInputs.defaultProps = {
  countryStatesList: emptyList,
  countryStatesMap: emptyMap,
  chosenCountry: emptyMap,

  onClientCountryUpdate: doNothing,
  onClientProvinceUpdate: doNothing,
  onValidateProvince: doNothing,
};

function LocationInputs(props) {
  const { t } = useTranslation();

  return (
    <Fragment>
      {renderCountryInput()}
      {renderProvinceInput()}
    </Fragment>
  );

  function renderCountryInput() {
    return (
      <div className={styles.countryInput}>
        <span>
          {t('Country: ')}
          <span className={styles.required}>{'*'}</span>
        </span>
        <Dropdown
          items={countryKeysList}
          keyValueMap={countryNamesMap}
          selectedItemId={props.country}
          dropdownClassName={styles.dropdown}
          onSelectItem={props.onClientCountryUpdate}
          buttonRenderer={renderCountryDropdownButton}
          dropdownItemRenderer={renderCountryDropdownItem}
        />
      </div>
    );
  }

  function renderCountryDropdownButton(isOpen) {
    const countryName = props.chosenCountry.name;

    return (
      <SecondaryButton className={styles.dropdownButton}>
        {countryName}
        {isOpen ? (
          <ChevronUp className={styles.dropdownButtonIcon} />
        ) : (
          <ChevronDown className={styles.dropdownButtonIcon} />
        )}
      </SecondaryButton>
    );
  }

  function renderCountryDropdownItem(countryKey) {
    return (
      <span key={countryKey} className={styles.dropdownItem} onClick={() => props.onClientCountryUpdate(countryKey)}>
        {countryNamesMap.get(countryKey)}
      </span>
    );
  }

  function renderProvinceInput() {
    return (
      <div className={styles.provinceInput}>
        <span>
          {t('Province / state: ')}
          <span className={styles.required}>{'*'}</span>
        </span>
        {props.chosenCountry.states ? (
          <Dropdown
            items={props.countryStatesList}
            keyValueMap={props.countryStatesMap}
            selectedItemId={props.province}
            dropdownClassName={styles.dropdown}
            onSelectItem={props.onClientProvinceUpdate}
            buttonRenderer={renderProvinceDropdownButton}
            dropdownItemRenderer={renderProvinceDropdownItem}
          />
        ) : (
          <UserInput
            onChange={(event) => props.onClientProvinceUpdate(event.target.value)}
            onBlur={props.onValidateProvince}
            className={styles.input}
            humanMessage={props.provinceHumanMessageModel}
          />
        )}
      </div>
    );
  }

  function renderProvinceDropdownButton(isOpen) {
    const provinceName = props.chosenCountry?.states?.[props.province]?.name;

    return (
      <SecondaryButton color={props.color} className={styles.dropdownButton}>
        {provinceName}
        {isOpen ? (
          <ChevronUp className={styles.dropdownButtonIcon} />
        ) : (
          <ChevronDown className={styles.dropdownButtonIcon} />
        )}
      </SecondaryButton>
    );
  }

  function renderProvinceDropdownItem(provinceKey) {
    return (
      <span key={provinceKey} onClick={() => props.onClientProvinceUpdate(provinceKey)} className={styles.dropdownItem}>
        {props.chosenCountry?.states?.[provinceKey]?.name}
      </span>
    );
  }
}

export default LocationInputs;
