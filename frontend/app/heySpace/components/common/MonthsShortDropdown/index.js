import useElementOpen from 'common/hooks/useElementOpen';
import usePrevious from 'common/hooks/usePrevious';
import { doNothing } from 'common/utils';
import Dropdown from 'commonComponents/Dropdown';
import { ChevronDown } from 'commonComponents/Icons/fontawesome/ChevronDown';
import { ChevronUp } from 'commonComponents/Icons/fontawesome/ChevronUp';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { useTranslation } from 'i18n';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import { monthKeys, monthValues } from './helpers';
import styles from './styles.css';

MonthsShortDropdown.propTypes = {
  color: PropTypes.string,
  selectedMonth: PropTypes.number,
  onSelectMonth: PropTypes.func,
};

MonthsShortDropdown.defaultProps = {
  onSelectMonth: doNothing,
};

function MonthsShortDropdown(props) {
  const {
    isOpen: isDropdownOpen,
    onClose: onCloseDropdown,
    onToggleOpen: onToggleDropdownOpen,
  } = useElementOpen(false);
  const [selectedMonth, onSelectMonthLocal] = useState(props.selectedMonth);

  const prevSelectedMonth = usePrevious(props.selectedMonth);
  useEffect(() => {
    if (prevSelectedMonth !== props.selectedMonth) {
      onSelectMonthLocal(props.selectedMonth);
    }
  }, [props.selectedMonth]);
  const { t } = useTranslation();
  return (
    <Dropdown
      items={monthKeys}
      className={props.className || styles.dropdown}
      dropdownClassName={styles.dropdownContent}
      selectedItemId={selectedMonth}
      buttonRenderer={renderDropdownButton}
      dropdownItemRenderer={renderDropdownItem}
      onSelectItem={onSelectMonth}
      onClickButtonDispatched={onToggleDropdownOpen}
      onClickOutsideDispatched={onCloseDropdown}
    />
  );

  function renderDropdownButton() {
    const month = monthValues.get(selectedMonth);
    return (
      <SecondaryButton className={styles.dropdownButton} color={props.color}>
        {month ? t(month) : t('Select month')}
        {isDropdownOpen ? <ChevronUp className={styles.chevron} /> : <ChevronDown className={styles.chevron} />}
      </SecondaryButton>
    );
  }

  function onSelectMonth(monthKey) {
    props.onSelectMonth(monthKey);
    onSelectMonthLocal(monthKey);
  }

  function renderDropdownItem(monthKey) {
    const month = monthValues.get(monthKey);
    return (
      <SecondaryButton className={styles.dropdownItem} color={props.color}>
        {t(month)}
      </SecondaryButton>
    );
  }
}

export default MonthsShortDropdown;
