import { doNothing } from 'common/utils';
import PropTypes from 'prop-types';
import { memo } from 'react';
import styles from './styles.css';

import SecondaryButton from 'components/buttons/SecondaryButton';

import { Computer, Dropbox, GoogleDrive } from 'commonComponents/Icons';
import { Paperclip } from 'commonComponents/Icons/fontawesome/Paperclip';

import TooltipedDisabledElement from 'commonComponents/TooltipedDisabledElement';
import UniversalPopover from 'commonComponents/UniversalPopover';
import { useTranslation } from 'i18n';
import DropboxChooser from 'react-dropbox-chooser';
import commonStyles from 'styles/common.css';

const iconSize = 20;
const DROPBOX_API_KEY = process.env.DROPBOX_API_KEY || '';

FileUploadButton.propTypes = {
  className: PropTypes.string,
  isPopoverOpened: PropTypes.bool,
  isDrivePickerEnabled: PropTypes.bool,
  isDropboxEnabled: PropTypes.bool,
  isHovering: PropTypes.bool,
  color: PropTypes.string,

  onGoogleDriveClick: PropTypes.func,
  onDropboxClick: PropTypes.func,
  onFileUploadIconClick: PropTypes.func,
  onDropboxFilesPick: PropTypes.func,
  onPopoverOpen: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

FileUploadButton.defaultProps = {
  isPopoverOpened: false,
  isDrivePickerEnabled: false,
  isDropboxEnabled: false,
  isHovering: false,

  onGoogleDriveClick: doNothing,
  onDropboxClick: doNothing,
  onDropboxFilesPick: doNothing,
  onFileUploadIconClick: doNothing,
  onPopoverOpen: doNothing,
  onMouseEnter: doNothing,
  onMouseLeave: doNothing,
};

function FileUploadButton(props) {
  const { t } = useTranslation();
  return (
    <UniversalPopover
      isPopoverOpened={props.isPopoverOpened}
      targetComponent={renderFileUploadIcon(props)}
      popperComponent={renderFileUploadOptions(props)}
      popperPlacement={'top'}
      popperModifiers={{
        offset: {
          offset: `0, ${parseInt(commonStyles.gridCellSize, 10) * 3}`,
        },
      }}
    />
  );

  function renderFileUploadOptions() {
    return (
      <div>
        <TooltipedDisabledElement
          isDisabled={!props.isDrivePickerEnabled}
          message={t(`To use our awesome Google Drive upgrade to Premium!`)}
        >
          {renderUploadWithGoogleButton()}
        </TooltipedDisabledElement>
        <TooltipedDisabledElement
          isDisabled={!props.isDropboxEnabled}
          message={t(`To use our awesome Dropbox upgrade to Premium!`)}
        >
          {renderUploadWithDropbox()}
        </TooltipedDisabledElement>
        <SecondaryButton className={styles.uploadOption} onClick={props.onFileUploadIconClick}>
          <Computer iconSize={iconSize} />
          {t('From computer')}
        </SecondaryButton>
      </div>
    );
  }

  function renderFileUploadIcon() {
    return (
      <SecondaryButton
        isActive={props.isPopoverOpened}
        activeClassName={styles.toolbarIconActive}
        className={styles.toolbarIcon}
        onClick={props.onPopoverOpen}
      >
        <Paperclip />
      </SecondaryButton>
    );
  }

  function renderUploadWithGoogleButton() {
    return (
      <SecondaryButton
        className={styles.uploadOption}
        onClick={props.onGoogleDriveClick}
        isDisabled={!props.isDrivePickerEnabled}
      >
        <GoogleDrive iconSize={iconSize} />
        {t('Google Drive')}
      </SecondaryButton>
    );
  }

  function renderUploadWithDropbox() {
    return (
      <DropboxChooser
        appKey={DROPBOX_API_KEY}
        success={props.onDropboxFilesPick}
        multiselect={true}
        disabled={!props.isDropboxEnabled}
      >
        <SecondaryButton
          className={styles.uploadOption}
          onClick={props.onDropboxClick}
          isDisabled={!props.isDropboxEnabled}
        >
          <Dropbox iconSize={iconSize} />
          {'Dropbox'}
        </SecondaryButton>
      </DropboxChooser>
    );
  }
}

export default memo(FileUploadButton);
