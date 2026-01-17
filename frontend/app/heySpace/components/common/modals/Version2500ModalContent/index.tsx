import React from 'react'
import { useTranslation } from '../../../../../common/i18n'
import styles from './styles.css'
import myTasksUrl from './myTasks.png'

const Version2500ModalContent = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.component}>
      <p><b>{t('Check out our latest changes.')}</b></p>
      <br />
      <p>
        <b>{t('Enhanced My Tasks view:')}</b>
        <br />
        <br />
        <ul>
          <li>{t('new views: Calendar and Timeline')}</li>
          <li>{t('persistable filters')}</li>
        </ul>
      </p>
      <br />
      <p><img src={myTasksUrl} className={styles.image} /></p>
      <br />
      <p>{t('We hope you\'ll enjoy this release.')}</p>
    </div>
  )
}

export default Version2500ModalContent
