import React from 'react'
import styles from './styles.css'

import SecondaryButton from 'components/buttons/SecondaryButton'
import useComponent from './hook'
import { useTranslation } from 'i18n'
import { Calendar } from 'commonComponents/Icons'

const DemoButton = () => {
  const { onClick } = useComponent()
  const { t } = useTranslation()
  return (
    <SecondaryButton
      className={styles.button}
      onClick={onClick}
    >
      <Calendar className={styles.icon} height={14} width={14} />
      {t('Book a demo')}
    </SecondaryButton>
  )
}

export default DemoButton
