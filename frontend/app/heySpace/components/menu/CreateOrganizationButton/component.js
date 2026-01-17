import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import { doNothing } from 'common/utils'

import MainMenuSubmenuButton from 'components/menu/MainMenuSubmenuButton'
import { useTranslation } from 'i18n'

CreateOrganizationButton.propTypes = {
  onCreateOrganization: PropTypes.func,
}

CreateOrganizationButton.defaultProps = {
  onCreateOrganization: doNothing,
}

function CreateOrganizationButton(props) {
  const { t } = useTranslation()
  return (
    <MainMenuSubmenuButton
      icon={PlusIcon}
      text={t('Create workspace')}
      className={styles.button}
      onClick={props.onCreateOrganization}
    />
  )
}

const PlusIcon = (props) => (
  <svg
    className={props.className}
    xmlns="http://www.w3.org/2000/svg"
    width={props.size}
    height={props.size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="0" x2="12" y2="24"></line>
    <line x1="0" y1="12" x2="24" y2="12"></line>
  </svg>
)

export default CreateOrganizationButton
