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
import { positionLabels, positionKeys } from './helpers';

PositionDropdown.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  selectedPosition: PropTypes.string,
  isDisabled: PropTypes.bool,
  onSelectPosition: PropTypes.func,
};

PositionDropdown.defaultProps = {
  selectedPosition: PeriodType.MONTHLY,
  isDisabled: false,
  onSelectPosition: doNothing,
};

function PositionDropdown(props) {
  const {
    isOpen: isDropdownOpen,
    onClose: onCloseDropdown,
    onToggleOpen: onToggleDropdownOpen,
  } = useElementOpen(false);
  const [selectedPosition, onSelectPositionLocal] = useState(
    props.selectedPosition
  );
  const prevSelectedPosition = usePrevious(props.selectedPosition);
  useEffect(() => {
    if (prevSelectedPosition !== props.selectedPosition) {
      onSelectPositionLocal(props.selectedPosition);
    }
  }, [props.selectedPosition]);

  const { t } = useTranslation();
  return (
    <Dropdown
      items={positionKeys}
      className={props.className || styles.dropdown}
      dropdownClassName={styles.dropdownContent}
      isDisabled={props.isDisabled}
      selectedItemId={selectedPosition}
      buttonRenderer={renderDropdownButton}
      dropdownItemRenderer={renderDropdownItem}
      onSelectItem={onSelectPosition}
      onClickButtonDispatched={onToggleDropdownOpen}
      onClickOutsideDispatched={onCloseDropdown}
    />
  );

  function renderDropdownButton() {
    const positionLabel = positionLabels.get(selectedPosition);
    return (
      <SecondaryButton className={styles.dropdownButton} color={props.color}>
        {positionLabel ? t(positionLabel) : t('Select period')}
        {isDropdownOpen ? (
          <ChevronUp className={styles.chevron} />
        ) : (
          <ChevronDown className={styles.chevron} />
        )}
      </SecondaryButton>
    );
  }

  function onSelectPosition(positionKey) {
    props.onSelectPosition(positionKey);
    onSelectPositionLocal(positionKey);
  }

  function renderDropdownItem(positionKey) {
    const positionLabel = positionLabels.get(positionKey);
    return (
      <SecondaryButton className={styles.dropdownItem} color={props.color}>
        {t(positionLabel)}
      </SecondaryButton>
    );
  }
}

export default PositionDropdown;
