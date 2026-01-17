import React, { FC } from 'react'
import styles from './styles.css'
import UniversalModal from 'commonComponents/UniversalModal'
import { useTranslation } from 'i18n'
import { useHistory } from 'react-router'

type NoAccessToFeatureModal = {
  featureName: string,
  title: string,
  fallbackUrl?: string,
}

const defaultProps = {
  fallbackUrl: '/'
}

const NoAccessToFeatureModal: FC<NoAccessToFeatureModal> = ({ fallbackUrl, featureName, title }) => {
  const { t } = useTranslation()
  const history = useHistory()
  return (
    <UniversalModal
      isModalOpen={true}
      shouldRenderHeader={false}
      shouldRenderCancelButton={false}
      shouldRenderFooter={false}
      onSetIsModalOpen={(isOpen) => !isOpen && history.push(fallbackUrl)}
    >
      <div className={styles.noAccessModalContent}>
        <div className={styles.mascot} />
        <div className={styles.title}>{title}</div>
        <div className={styles.subtitle}>
          <span className={styles.subtitle}>{t('Don’t give us that look ;)')}</span>
          <br />
          <span className={styles.subtitle}>{t('Our team is working days and nights to provide you with a great quality product.')}</span>
          <br />
          <span className={styles.subtitle}>
            {t('This feature is not available for your workspace.')}
          </span>
        </div>
      </div>
    </UniversalModal>
  )
}

NoAccessToFeatureModal.defaultProps = defaultProps

export default NoAccessToFeatureModal
