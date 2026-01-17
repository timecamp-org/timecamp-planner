import { Button } from '@mui/material';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import UniversalModal from 'commonComponents/UniversalModal';
import UserInput from 'commonComponents/UserInput';
import UserInputWithCopy from 'commonComponents/UserInputWithCopy';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { useTranslation } from 'i18n';

import AppCollaborators from '../AppCollaborators';
import ClientThumbnail from '../ClientThumbnail';
import UploadThumbnailButton from '../UploadThumbnailButton';

import styles from './styles.css';

EditAppModal.propTypes = {
  className: PropTypes.string,
  clientName: PropTypes.string,
  appId: PropTypes.string,
  clientId: PropTypes.string,
  clientSecret: PropTypes.string,
  clientRedirectUris: PropTypes.string,
  clientThumbnailUrl: PropTypes.string,
  isDeleting: PropTypes.bool,
  isCurrentUserAppOwner: PropTypes.bool,
  onSetIsModalOpen: PropTypes.func,
  onUpdateClientName: PropTypes.func,
  onUpdateRedirectUris: PropTypes.func,
  onDeleteUserApp: PropTypes.func,
  onSetIsDeleting: PropTypes.func,
  onRegenerateClientSecret: PropTypes.func,
  onLeaveAppCollaborators: PropTypes.func,
};

EditAppModal.defaultProps = {
  className: '',
  clientName: '',
  clientSecret: '',
  clientRedirectUris: '',
  isDeleting: false,
  isCurrentUserAppOwner: false,
  onSetIsModalOpen: doNothing,
  onUpdateClientName: doNothing,
  onUpdateClientRedirectUris: doNothing,
  onModalSave: doNothing,
  onDeleteUserApp: doNothing,
  onSetIsDeleting: doNothing,
  onRegenerateClientSecret: doNothing,
  onLeaveAppCollaborators: doNothing,
};

function EditAppModal(props) {
  const { t } = useTranslation();

  return (
    <UniversalModal
      isModalOpen={props.isModalOpen}
      modalBodyClassName={styles.modalBody}
      header={getHeader(props, t)}
      footer={renderFooter(props, t)}
      onSetIsModalOpen={props.onSetIsModalOpen}
    >
      {props.isDeleting ? renderDeleteModalInner(t) : renderEditModalInner(props, t)}
    </UniversalModal>
  );
}

function getHeader(props, t) {
  if (props.isDeleting) {
    return t('Delete {{clientName}}', { clientName: props.clientName });
  } else {
    return t('Update {{clientName}}', { clientName: props.clientName });
  }
}

function renderEditModalInner(props, t) {
  return (
    <div className={styles.modalContent}>
      {renderBasicColumn(props, t)}
      {renderAuthorizationColumn(props, t)}
    </div>
  );
}

function renderBasicColumn(props, t) {
  return (
    <div className={styles.modalColumn}>
      <span className={styles.columnHeader}>{t('General')}</span>
      <div className={styles.row}>
        <ClientThumbnail
          className={styles.thumbnail}
          clientThumbnailUrl={props.clientThumbnailUrl}
          clientName={props.clientName}
        />
        <UploadThumbnailButton appId={props.appId} />
      </div>
      <UserInput
        className={styles.input}
        autoFocus
        value={props.clientName}
        label={t('App name')}
        placeholder={t('Change app name…')}
        onChange={props.onUpdateClientName}
      />
      <div className={styles.row}>
        <span className={styles.label}>{t('Collaborators')}</span>
        <AppCollaborators appId={props.appId} onLeaveAppCollaborators={props.onLeaveAppCollaborators} />
      </div>
    </div>
  );
}

function renderAuthorizationColumn(props, t) {
  return (
    <div className={styles.modalColumn}>
      <span className={styles.columnHeader}>{t('Authorization')}</span>
      <UserInputWithCopy className={styles.input} value={props.clientId} label={t('Client ID')} isDisabled />
      <UserInputWithCopy className={styles.input} value={props.clientSecret} label={t('Client Secret')} isDisabled />
      <SecondaryButton className={styles.leftAlignButton} onClick={props.onRegenerateClientSecret}>
        {t('Regenerate secret')}
      </SecondaryButton>
      <UserInput
        className={styles.input}
        value={props.clientRedirectUris}
        label={t('Redirect uris')}
        placeholder={t('Type in uris separated by a space…')}
        onChange={props.onUpdateClientRedirectUris}
      />
    </div>
  );
}

function renderDeleteModalInner(t) {
  return <div className={styles.confirmModalBody}>{t(`Are you sure you want to delete this app?`)}</div>;
}

function renderFooter(props, t) {
  return (
    <div className={styles.modalFooter}>
      {props.isDeleting ? renderFooterCaseDeleting(props, t) : renderFooterCaseEditing(props, t)}
    </div>
  );
}

function renderFooterCaseEditing(props, t) {
  return (
    <>
      {props.isCurrentUserAppOwner && renderDeleteAppButton(props, t)}
      <Button variant="text" onClick={() => props.onSetIsModalOpen(false)}>
        {t('Cancel')}
      </Button>
      <Button onClick={props.onModalSave}>{t('Save')}</Button>
    </>
  );
}

function renderDeleteAppButton(props, t) {
  return (
    <Button variant="text" className={styles.leftAlignButton} onClick={() => props.onSetIsDeleting(true)}>
      {t('Delete {{clientName}}', { clientName: props.clientName })}
    </Button>
  );
}

function renderFooterCaseDeleting(props, t) {
  return (
    <>
      <Button variant="text" onClick={() => props.onSetIsModalOpen(false)}>
        {t('Cancel')}
      </Button>
      <Button onClick={props.onDeleteUserApp}>{t('Delete')}</Button>
    </>
  );
}

export default EditAppModal;
