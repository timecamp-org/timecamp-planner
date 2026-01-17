import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { doNothing } from 'common/utils';
import UniversalModal from 'commonComponents/UniversalModal';
import { i18mark, useTranslation } from 'i18n';
import { onOpenModal } from 'models/component/ModalsModel/actions';
import { ModalType } from 'models/component/ModalsModel/types';
import { CreateWorkspaceStep } from 'models/domain/OrganizationsModel/types';

import NewWorkspaceForm from '../NewWorkspaceForm';
import WorkspaceInvitationsForm from '../WorkspaceInvitationsForm';

import styles from './styles.css';

NewWorkspaceModal.propTypes = {
  isWorkspaceModalOpen: PropTypes.bool,
  createWorkspaceStep: PropTypes.string.isRequired,

  onSetIsWorkspaceModalOpen: PropTypes.func,
  onCloseWorkspaceModal: PropTypes.func,
};

NewWorkspaceModal.defaultProps = {
  isWorkspaceModalOpen: false,
  onSetIsWorkspaceModalOpen: doNothing,
  onCloseWorkspaceModal: doNothing,
};

const HEADER = {
  [CreateWorkspaceStep.CREATE_WORKSPACE]: i18mark('CREATE NEW WORKSPACE'),
  [CreateWorkspaceStep.WORKSPACE_INVITATIONS]: i18mark('INVITE PEOPLE TO WORKSPACE'),
};

function NewWorkspaceModal(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onSubmit = () => {
    props.onCloseWorkspaceModal();
    dispatch(onOpenModal(ModalType.ADD_FIRST_PROJECT_MODAL));
  };

  return (
    <UniversalModal
      innerModalDialogClassName={styles.modalDialog}
      modalBodyClassName={styles.modalBody}
      isModalOpen={props.isWorkspaceModalOpen}
      onBackdropClick={props.onCloseWorkspaceModal}
      onSetIsModalOpen={props.onSetIsWorkspaceModalOpen}
      shouldRenderFooter={false}
      header={t(HEADER?.[props.createWorkspaceStep])}
    >
      {renderCreateWorkspaceStep()}
    </UniversalModal>
  );

  function renderCreateWorkspaceStep() {
    switch (props.createWorkspaceStep) {
      case CreateWorkspaceStep.CREATE_WORKSPACE:
        return (
          <NewWorkspaceForm
            className={styles.form}
            submitButtonClassName={styles.submitButtonClassName}
            submitButtonInnerClassName={styles.submitButtonInnerClassName}
            switchToNewOrganization={true}
            onCancel={props.onCloseWorkspaceModal}
            onSuccess={props.onOpenInviteModal}
          />
        );
      case CreateWorkspaceStep.WORKSPACE_INVITATIONS:
        return (
          <WorkspaceInvitationsForm
            submitButtonClassName={styles.submitButtonClassName}
            submitButtonInnerClassName={styles.submitButtonInnerClassName}
            onSubmit={onSubmit}
            onCloseIviteUserModal={props.onCloseWorkspaceModal}
          />
        );
      default:
        return null;
    }
  }
}

export default NewWorkspaceModal;
