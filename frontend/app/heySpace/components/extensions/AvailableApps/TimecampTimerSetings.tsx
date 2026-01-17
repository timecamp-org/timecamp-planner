import { useState } from 'react';

import { ButtonBase, SxProps } from '@mui/material';
import { useDispatch } from 'react-redux';

import { useTranslation } from 'common/i18n';
import { ThreeDotsVertical } from 'commonComponents/Icons';
import PopoverContent from 'commonComponents/PopoverContent';
import UniversalPopover from 'commonComponents/UniversalPopover';
import { onOpenModal } from 'models/component/ModalsModel/actions';
import { ModalType } from 'models/component/ModalsModel/types';

const popperButtonStyles: SxProps = { padding: '1rem' };

export const TimecampTimerSettings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const onClosePopper = () => setIsPopoverOpen(false);
  const onToggleOpen = () => setIsPopoverOpen((open) => !open);

  const onOpenTimecampTimerSettings = () => {
    dispatch(onOpenModal(ModalType.TIMECAMP_API_KEY_MODAL));
    onClosePopper();
  };

  return (
    <PopoverContent onClickOutside={onClosePopper} isVisible={isPopoverOpen}>
      <UniversalPopover
        isPopoverOpened={isPopoverOpen}
        targetComponent={
          <ButtonBase onClick={onToggleOpen} sx={popperButtonStyles}>
            <ThreeDotsVertical />
          </ButtonBase>
        }
        popperComponent={
          <ButtonBase onClick={onOpenTimecampTimerSettings}>{t('Edit TimeCamp timer API Key')}</ButtonBase>
        }
        popperPlacement={'bottom'}
      />
    </PopoverContent>
  );
};
