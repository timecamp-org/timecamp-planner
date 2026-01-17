import { Button } from '@mui/material';
import { List } from 'immutable';
import ImmutablePropTypes from 'immutable-prop-types';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import ProgressSteps from 'commonComponents/ProgressSteps';
import { UnderlinedMultiInviteInput } from 'commonComponents/UnderlinedMultiInviteInput';
import UniversalModal from 'commonComponents/UniversalModal';
import UserLabel from 'commonComponents/UserLabel';
import { useTranslation } from 'i18n';

import styles from './styles.css';

WorkspaceInvitationsForm.propTypes = {
  email: PropTypes.string,
  title: PropTypes.string,
  workspaceNameHumanMessageModel: PropTypes.object,
  genericHumanMessageModel: PropTypes.object,
  organizationUserIds: ImmutablePropTypes.list,
  isInviteUserModalOpen: PropTypes.bool.isRequired,

  onCloseIviteUserModal: PropTypes.func.isRequired,
  onInviteUserAndSubmit: PropTypes.func.isRequired,
  onClickSubmitButton: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onEmailChange: PropTypes.func,
  onSendInvitations: PropTypes.func,
  onKeyDown: PropTypes.func,
  onSetInnerRef: PropTypes.func,
  onBlur: PropTypes.func,
};

WorkspaceInvitationsForm.defaultProps = {
  email: null,
  organizationUserIds: new List(),
  title: '',
  isInviteUserModalOpen: false,

  onCloseIviteUserModal: doNothing,
  onInviteUserAndSubmit: doNothing,
  onClickSubmitButton: doNothing,
  onSubmit: doNothing,
  onEmailChange: doNothing,
  onSendInvitations: doNothing,
  onKeyDown: doNothing,
  onSetInnerRef: doNothing,
  onBlur: doNothing,
};

function WorkspaceInvitationsForm(props) {
  const { t } = useTranslation();

  return (
    <div className={props.className || styles.Component} onKeyDown={props.onKeyDown}>
      {props.title && <div className={styles.header}>{t(props.title)}</div>}
      <div className={styles.tip}>
        {t(
          `Invite your teammates to this workspace and start working together. You can always do it later from Workspace Settings.`
        )}
      </div>
      {renderForm()}
      <ProgressSteps stepsCount={2} currentStep={2} />
      {props.isInviteUserModalOpen && renderInviteUserModal()}
      <footer>{renderSubmitButton()}</footer>
    </div>
  );

  function renderForm() {
    return (
      <div className={styles.form}>
        <UnderlinedMultiInviteInput
          placeholder={t('email@company.com')}
          emailHumanMessageModel={props.emailHumanMessageModel}
          onSubmit={props.onSendInvitations}
          onChange={props.onEmailChange}
          onSelectedEmailsChange={props.onSelectedEmailsChange}
        />
        {renderPendingInvitations()}
      </div>
    );
  }

  function renderSubmitButton() {
    return (
      <Button className={styles.submitButtonClassName} type="submit" onClick={props.onClickSubmitButton}>
        {t('Start exploring')}
      </Button>
    );
  }

  function renderPendingInvitations() {
    return (
      <>
        {props.organizationUserIds.size && <p className={styles.listHeader}>{t('INVITATIONS SENT TO:')}</p>}
        <div className={styles.userPendingInvitations}>{props.organizationUserIds.map(renderUserFullName)}</div>
      </>
    );
  }

  function renderUserFullName(userId) {
    return (
      <UserLabel
        key={userId}
        className={styles.userLabel}
        innerClassName={styles.userLabelInner}
        userId={userId}
        shouldRenderEmail={false}
        shouldRenderInvitationStatus={true}
      />
    );
  }

  function renderInviteUserModal() {
    return (
      <UniversalModal
        isModalOpen={true}
        saveButtonCaption={t(`Invite and continue`)}
        cancelButtonCaption={t(`Dont't invite and continue`)}
        onSetIsModalOpen={props.onCloseIviteUserModal}
        onModalSave={props.onInviteUserAndSubmit}
        onModalCancel={props.onSubmit}
      >
        <div>{t(`Invitation wasn't sent. Do you want to send it?`)}</div>
      </UniversalModal>
    );
  }
}

export default WorkspaceInvitationsForm;
