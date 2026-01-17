import React, { ReactElement, RefObject, useRef } from 'react';

import useElementOpen from 'common/hooks/useElementOpen';
import { PeriodDurationType } from 'common/utils/timeIntervalDefinitions';
import { DropdownChevron as DropdownChevronDown } from 'commonComponents/Icons/index-NEW';
import UniversalPopover from 'commonComponents/UniversalPopover';
import Button from 'components/buttons/Button';
import useOnPopoverClickOutside from 'hooks/useOnPopoverClickOutside';
import { useTranslation } from 'i18n';
import { TranslateFunction } from 'i18n/types';

import styles from './styles.css';
import { getDropdownItem, getLabelName } from './utils';

const dropdownOptions = [
  PeriodDurationType.WEEK,
  PeriodDurationType.TWO_WEEKS,
  PeriodDurationType.MONTH,
  PeriodDurationType.QUARTER,
  PeriodDurationType.HALF_YEAR,
].map(getDropdownItem);

export type VisibleTimePeriodDropdownInterface = {
  selectedTimePeriodDurationType: PeriodDurationType;
  onChangeVisibleTimePeriodDurationType: (duration: PeriodDurationType) => void;
};

const VisibleTimePeriodDropdown: React.FC<VisibleTimePeriodDropdownInterface> = (props) => {
  const {
    isOpen: isDropdownOpen,
    onToggleOpen: onToggleOpenDropdown,
    onClose: onCloseDropdown,
  } = useElementOpen(false);
  const popoverTargetRef: RefObject<HTMLButtonElement> = useRef();
  useOnPopoverClickOutside(popoverTargetRef, onCloseDropdown);
  const { t } = useTranslation();

  return (
    <UniversalPopover
      isPopoverOpened={isDropdownOpen}
      targetClassName={styles.targetWrapperClassName}
      targetComponent={renderTargetComponent({
        t,
        isDropdownOpen,
        popoverTargetRef,
        onToggleOpenDropdown,
        selectedTimePeriodDurationType: props.selectedTimePeriodDurationType,
      })}
      popperComponent={renderPopperComponent({
        t,
        onCloseDropdown,
        onChangeVisibleTimePeriodDurationType: props.onChangeVisibleTimePeriodDurationType,
      })}
      popperContentWrapperClassName={styles.popperContent}
      popperPlacement={'bottom'}
      popperArrowFillClassName={styles.popperArrowFillClassName}
      popperModifiers={{
        offset: {
          offset: `0, 15`,
        },
      }}
    />
  );
};

type TargetComponentProps = {
  t: TranslateFunction;
  isDropdownOpen: boolean;
  popoverTargetRef: RefObject<HTMLButtonElement>;
  selectedTimePeriodDurationType: PeriodDurationType;
  onToggleOpenDropdown: VoidFunction;
};

function renderTargetComponent({
  t,
  isDropdownOpen,
  popoverTargetRef,
  onToggleOpenDropdown,
  selectedTimePeriodDurationType,
}: TargetComponentProps): ReactElement {
  return (
    <Button
      className={styles.targetButtonClassName}
      isActive={isDropdownOpen}
      ref={popoverTargetRef}
      onClick={onToggleOpenDropdown}
    >
      <span>{t(getLabelName(selectedTimePeriodDurationType))}</span>
      <DropdownChevronDown className={isDropdownOpen ? styles.chevronIconUp : styles.chevronIcon} />
    </Button>
  );
}

type PopperComponentProps = {
  t: TranslateFunction;
  onCloseDropdown: VoidFunction;
  onChangeVisibleTimePeriodDurationType: (key: PeriodDurationType) => void;
};

function renderPopperComponent({
  t,
  onCloseDropdown,
  onChangeVisibleTimePeriodDurationType,
}: PopperComponentProps): ReactElement {
  return (
    <div className={styles.dropdownContent}>
      {dropdownOptions.map(({ label, key }) => (
        <button
          className={styles.dropdownButton}
          key={key}
          onClick={() => {
            onCloseDropdown();
            onChangeVisibleTimePeriodDurationType(key);
          }}
        >
          {t(label)}
        </button>
      ))}
    </div>
  );
}

export default VisibleTimePeriodDropdown;
