import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'i18n';
import useElementOpen from 'common/hooks/useElementOpen';
import usePrevious from 'common/hooks/usePrevious';
import { doNothing } from 'common/utils';
import { PeriodType } from 'common/types';

import Dropdown from 'commonComponents/Dropdown';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { ChevronUp, ChevronDown } from 'commonComponents/Icons';
import styles from './styles.css';
import { periodLabels, periodKeys } from './helpers';

PeriodDropdown.propTypes = {
  color: PropTypes.string,
  selectedPeriod: PropTypes.string,
  isDisabled: PropTypes.bool,
  onSelectPeriod: PropTypes.func,
};

PeriodDropdown.defaultProps = {
  selectedPeriod: PeriodType.MONTHLY,
  isDisabled: false,
  onSelectPeriod: doNothing,
};

function PeriodDropdown(props) {
  const {
    isOpen: isDropdownOpen,
    onClose: onCloseDropdown,
    onToggleOpen: onToggleDropdownOpen,
  } = useElementOpen(false);
  const [selectedPeriod, onSelectPeriodLocal] = useState(props.selectedPeriod);
  const prevSelectedPeriod = usePrevious(props.selectedPeriod);
  useEffect(() => {
    if (prevSelectedPeriod !== props.selectedPeriod) {
      onSelectPeriodLocal(props.selectedPeriod);
    }
  }, [props.selectedPeriod]);

  const { t } = useTranslation();
  return (
    <Dropdown
      items={periodKeys}
      className={props.className || styles.dropdown}
      dropdownClassName={styles.dropdownContent}
      isDisabled={props.isDisabled}
      selectedItemId={selectedPeriod}
      buttonRenderer={renderDropdownButton}
      dropdownItemRenderer={renderDropdownItem}
      onSelectItem={onSelectPeriod}
      onClickButtonDispatched={onToggleDropdownOpen}
      onClickOutsideDispatched={onCloseDropdown}
    />
  );

  function renderDropdownButton() {
    const periodLabel = periodLabels.get(selectedPeriod);
    return (
      <SecondaryButton className={styles.dropdownButton} color={props.color}>
        {periodLabel ? t(periodLabel) : t('Select period')}
        {isDropdownOpen ? (
          <ChevronUp className={styles.chevron} />
        ) : (
          <ChevronDown className={styles.chevron} />
        )}
      </SecondaryButton>
    );
  }

  function onSelectPeriod(periodType) {
    props.onSelectPeriod(periodType);
    onSelectPeriodLocal(periodType);
  }

  function renderDropdownItem(periodType) {
    const periodLabel = periodLabels.get(periodType);
    return (
      <SecondaryButton className={styles.dropdownItem} color={props.color}>
        {t(periodLabel)}
      </SecondaryButton>
    );
  }
}

export default PeriodDropdown;
