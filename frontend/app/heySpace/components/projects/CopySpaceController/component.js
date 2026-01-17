import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'i18n';
import styles from './styles.css';

import SecondaryButton from 'components/buttons/SecondaryButton';
import UniversalPopover from 'commonComponents/UniversalPopover';
import useElementOpen from 'common/hooks/useElementOpen';
import PopoverContent from 'commonComponents/PopoverContent';
import CopySpacePopoverContent from 'components/projects/CopySpacePopoverContent';

CopySpaceController.propTypes = {
  projectId: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
};

CopySpaceController.defaultProps = {
  isDisabled: false,
};

function CopySpaceController(props) {
  const { t } = useTranslation();
  const { isOpen: isPopoverOpen, onClose: onClosePopover, onToggleOpen: onToggleOpenPopover } = useElementOpen(false);

  return (
    <div className={styles.copySpaceController}>
      <PopoverContent isVisible={isPopoverOpen} onClickOutside={onToggleOpenPopover}>
        <UniversalPopover
          isPopoverOpened={isPopoverOpen}
          targetComponent={
            <SecondaryButton onClick={onToggleOpenPopover} color={props.color} isDisabled={props.isDisabled}>
              {t('Copy project')}
            </SecondaryButton>
          }
          popperComponent={
            <CopySpacePopoverContent
              projectId={props.projectId}
              onCopiedSpace={onClosePopover}
              onCopySpaceCancelled={onClosePopover}
            />
          }
          popperPlacement={'top'}
          popperModifiers={{
            offset: {
              offset: `0, 15`,
            },
          }}
        />
      </PopoverContent>
    </div>
  );
}

export default CopySpaceController;
