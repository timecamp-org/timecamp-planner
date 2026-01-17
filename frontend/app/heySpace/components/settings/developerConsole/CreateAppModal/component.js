import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'i18n'
import { doNothing } from 'common/utils'

import UniversalModal from 'commonComponents/UniversalModal'
import UserInput from 'commonComponents/UserInput'

import styles from './styles.css'

CreateAppModal.propTypes = {
  className: PropTypes.string,
  clientName: PropTypes.string,
  isModalVisible: PropTypes.bool,
  onSetIsModalOpen: PropTypes.func,
  onUpdateClientName: PropTypes.func,
  onCreateUserApp: PropTypes.func,
  onKeyDown: PropTypes.func,
}

CreateAppModal.defaultProps = {
  className: '',
  clientName: '',
  isModalVisible: false,
  onSetIsModalOpen: doNothing,
  onUpdateClientName: doNothing,
  onCreateUserApp: doNothing,
  onKeyDown: doNothing,
}

function CreateAppModal(props) {
  const { t } = useTranslation()
  return (
    <UniversalModal
      isModalOpen={props.isModalVisible}
      modalBodyClassName={styles.modalBody}
      header={t('CREATE NEW APP')}
      onSetIsModalOpen={props.onSetIsModalOpen}
      onModalSave={props.onCreateUserApp}
    >
      {renderModalInner(props, t)}
    </UniversalModal>
  )
}

function renderModalInner(props, t) {
  return (
    <div className={styles.appForm}>
      <UserInput
        autoFocus
        value={props.clientName}
        label={t('App name')}
        placeholder={t('Add app name…')}
        onChange={props.onUpdateClientName}
        onKeyDown={props.onKeyDown}
      />
    </div>
  )
}

export default CreateAppModal
