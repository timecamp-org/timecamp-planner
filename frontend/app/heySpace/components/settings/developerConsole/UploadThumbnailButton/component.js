import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'i18n';
import DropzoneWrapper from 'commonComponents/DropzoneWrapper';
import SecondaryButton from 'components/buttons/SecondaryButton';

import styles from './styles.css';

UploadThumbnailButton.propTypes = {
  className: PropTypes.string,
};

UploadThumbnailButton.defaultProps = {
  className: '',
};

function UploadThumbnailButton(props) {
  const { t } = useTranslation();
  return (
    <SecondaryButton
      className={props.className || styles.Component}
      onClick={props.onOpenFilePrompt}
    >
      <span className={styles.title}>{t('Upload image')}</span>
      <DropzoneWrapper
        noClick
        noKeyboard
        style={{ visible: 'none' }}
        onSetOpenCallback={props.onSetOpenCallback}
        onDrop={props.onChooseFile}
      />
    </SecondaryButton>
  );
}

export default UploadThumbnailButton;
