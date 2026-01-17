import isToday from 'date-fns/is_today';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import { File, X as XIcon } from 'commonComponents/Icons';
import ProgressiveFileImage from 'commonComponents/ProgressiveFileImage';
import UniversalModal from 'commonComponents/UniversalModal';
import SecondaryButton from 'components/buttons/SecondaryButton';
import PersonFullName from 'components/person/PersonFullName';
import TimeOutput from 'components/time/TimeOutput';
import { useTranslation } from 'i18n';
import { isImage } from 'models/domain/FilesModel/helpers';
import { ImageSize } from 'models/domain/FilesModel/types';

import styles from './styles.css';

TaskAttachment.propTypes = {
  id: PropTypes.string.isRequired,
  isModalOpen: PropTypes.bool,
  color: PropTypes.string,
  fileUrl: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  fileTimestamp: PropTypes.number.isRequired,
  fileUserId: PropTypes.string.isRequired,
  fileContentType: PropTypes.string.isRequired,

  onDeleteFile: PropTypes.func.isRequired,
  onSetIsModalOpen: PropTypes.func.isRequired,
  onOpenImageGallery: PropTypes.func.isRequired,
};

TaskAttachment.defaultProps = {
  isModalOpen: false,
  fileUrl: '',
  fileName: '',
  fileContentType: '',
  fileTimestamp: 0,

  onDeleteFile: doNothing,
  onSetIsModalOpen: doNothing,
  onOpenImageGallery: doNothing,
};

function TaskAttachment(props) {
  const { t } = useTranslation();

  return (
    <div className={styles.attachment}>
      <div className={styles.image}>
        {isImage(props.fileContentType) ? renderImage(props) : renderFile(props)}
        <SecondaryButton className={styles.deleteButton} onClick={() => props.onSetIsModalOpen(true)}>
          <XIcon className={styles.deleteIcon} />
        </SecondaryButton>
        <UniversalModal
          isModalOpen={props.isModalOpen}
          saveButtonCaption={t('DELETE')}
          header={t('DELETE FILE')}
          onModalSave={props.onDeleteFile}
          onSetIsModalOpen={props.onSetIsModalOpen}
          shouldRenderCloseIcon={false}
          color={props.color}
          footerButtonsColor="error"
        >
          {t('Are you sure you want to delete this file? This cannot be undone.')}
        </UniversalModal>
      </div>
      <div className={styles.messageInfo}>
        <a className={styles.fileName} href={props.fileUrl} target={'_blank'}>
          {props.fileName}
        </a>
        <div className={styles.username}>
          {t('Added ')}
          <TimeOutput
            timestamp={props.fileTimestamp}
            format={isToday(new Date(props.fileTimestamp)) ? 'HH:mm' : 'MMM D, YYYY'}
          />
        </div>
        <div className={styles.username}>
          {t('By ')}
          <PersonFullName userId={props.fileUserId} />
        </div>
      </div>
    </div>
  );
}

function renderImage(props) {
  return (
    <ProgressiveFileImage
      id={props.id}
      className={styles.image}
      maxSize={ImageSize.SMALL}
      onClick={props.onOpenImageGallery}
      shouldRenderGifAsPicture={true}
    />
  );
}

function renderFile(props) {
  return (
    <a href={props.fileUrl} target={'_blank'}>
      <File width={75} height={94} />
    </a>
  );
}

export default TaskAttachment;
