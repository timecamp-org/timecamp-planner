import React from 'react'
import PropTypes from 'prop-types'
import UniversalModal from 'commonComponents/UniversalModal'
import styles from './styles.css'
import { doNothing } from 'common/utils'
import { useTranslation } from 'i18n'

ReactivateUserModal.propTypes = {
  className: PropTypes.string,
  isModalVisible: PropTypes.bool.isRequired,
  fullName: PropTypes.string.isRequired,
  workspaceName: PropTypes.string.isRequired,

  onReactivateUserFromOrganization: PropTypes.func.isRequired,
  onSetIsModalVisible: PropTypes.func.isRequired,
  onToggleModalVisible: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func.isRequired,
}

ReactivateUserModal.defaultProps = {
  isModalVisible: true,
  fullName: '',
  workspaceName: '',

  onReactivateUserFromOrganization: doNothing,
  onSetIsModalVisible: doNothing,
  onToggleModalVisible: doNothing,
  onCloseModal: doNothing,
}

function ReactivateUserModal(props) {
  const { t } = useTranslation()
  return (
    <UniversalModal
      isModalOpen={props.isModalVisible}
      backdropClassName={styles.backdrop}
      cancelButtonCaption={t('Undo')}
      saveButtonCaption={t('Got it!')}
      onModalSave={props.onCloseModal}
      onModalCancel={props.onReactivateUserFromOrganization}
      shouldRenderCloseIcon={false}
      shouldFocusOnOpen={true}
    >
      {t(`{{fullName}} has been succesfully disabled from the {{workspaceName}} workspace.`, { fullName: props.fullName, workspaceName: props.workspaceName })}
    </UniversalModal>

  )
}

export default ReactivateUserModal
