import React from 'react'
import { useTranslation } from '../../../../../common/i18n'
import logoUrl from './logo.png'
import styles from './styles.css'

const Version2430ModalContent = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.component}>
      <p><b>{t('Check out our latest changes.')}</b></p>
      <br />
      <img src={logoUrl} className={styles.logo} />
      <ul>
        <li>
          <b>{t('Make integration')}</b>
          {' - '}
          <a href='https://www.integromat.com/en/integrations/heyspace' target='_blank'>
            {t('Create your customized scenario and automate repetitive tasks or messages.')}
          </a>
        </li>
        <li>
          <b>{t('Hangouts call notification')}</b>
          {t(' - Create chat message when joining Hangouts video call.')}
        </li>
      </ul>
      <br />
      <p>{t('We hope you\'ll enjoy this release.')}</p>
    </div>
  )
}

export default Version2430ModalContent