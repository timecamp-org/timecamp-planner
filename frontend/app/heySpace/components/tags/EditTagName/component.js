import React from 'react';

import { Button } from '@mui/material';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import { Pen } from 'commonComponents/Icons/fontawesome/Pen';
import InfoTooltip from 'commonComponents/InfoTooltip';
import UniversalPopover from 'commonComponents/UniversalPopover';
import UserInput from 'commonComponents/UserInput';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { useTranslation } from 'i18n';

import styles from './styles.css';

const transitionDuration = 100;

EditTagName.propTypes = {
  tagName: PropTypes.string.isRequired,
  isMouseOverButton: PropTypes.bool,
  isPopoverOpened: PropTypes.bool,
  onChangeTagName: PropTypes.func,
  onMouseEnterButton: PropTypes.func,
  onMouseLeaveButton: PropTypes.func,
  onIconClick: PropTypes.func,
  onUpdateTagName: PropTypes.func,
  onClosePopover: PropTypes.func,
};

EditTagName.defaultProps = {
  isPopoverOpened: false,
  isMouseOverButton: false,
  onMouseEnterButton: doNothing,
  onMouseLeaveButton: doNothing,
  onChangeTagName: doNothing,
  onIconClick: doNothing,
};

function EditTagName(props) {
  const { t } = useTranslation();

  return (
    <InfoTooltip
      shouldRenderInfoTooltip={props.isMouseOverButton}
      popperPlacement={'bottom'}
      targetComponent={
        <UniversalPopover
          isPopoverOpened={props.isPopoverOpened}
          targetComponent={
            <SecondaryButton
              onClick={props.onIconClick}
              className={styles.button}
              onMouseEnter={props.onMouseEnterButton}
              onMouseLeave={props.onMouseLeaveButton}
            >
              <Pen className={styles.icon} />
            </SecondaryButton>
          }
          popperComponent={
            <React.Fragment>
              <span className={styles.title}>{t('Change tag name')}</span>
              <UserInput
                innerClassName={styles.input}
                value={props.tagName}
                onChange={props.onChangeTagName}
                autoFocus
              />
              <div className={styles.buttons}>
                <Button variant="text" onClick={props.onClosePopover}>
                  {t('Cancel')}
                </Button>
                <Button onClick={props.onUpdateTagName}>{t('Save')}</Button>
              </div>
            </React.Fragment>
          }
          popperPlacement={'bottom'}
          popperModifiers={{
            offset: {
              offset: `0, 10`,
            },
          }}
          transitionDuration={0}
        />
      }
      message={t(`To use our awesome Tags upgrade to Premium!`)}
      transitionDuration={transitionDuration}
    />
  );
}

export default EditTagName;
