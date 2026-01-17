import useElementOpen from 'common/hooks/useElementOpen';
import { PeriodDurationType } from 'common/utils/timeIntervalDefinitions';
import UnderlinedDropdown from 'commonComponents/UnderlinedDropdown/UnderlinedDropdown';
import useOnPopoverClickOutside from 'hooks/useOnPopoverClickOutside';
import { useTranslation } from 'i18n';
import React, { RefObject, useRef } from 'react';
import { getDropdownItem, getLabelName } from './utils';
import { Box, SxProps } from '@mui/material';
import styled from 'styles/styled';

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
const dropdownWrapperStyles: SxProps = {
  display: 'flex',
  alignItems: 'flex-end',
  gap: '1rem',
};

const SelectedView = styled.span`
  margin-bottom: 0.4rem;
`;

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
    <Box sx={dropdownWrapperStyles}>
      <SelectedView>{t('View')}:</SelectedView>
      <UnderlinedDropdown
        label={getLabelName(props.selectedTimePeriodDurationType)}
        items={dropdownOptions.map(({ label, key }) => ({
          label: t(label),
          isSelected: false,
          props: {
            onClick: () => props.onChangeVisibleTimePeriodDurationType(key),
          },
        }))}
      />
    </Box>
  );
};

export default VisibleTimePeriodDropdown;
