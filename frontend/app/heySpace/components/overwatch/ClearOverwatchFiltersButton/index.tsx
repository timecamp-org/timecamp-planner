import React, { FC } from 'react'
import Button from 'components/buttons/Button'
import { useTranslation } from 'i18n'
import styles from './styles.css'
import useComponent from './hook'

const ClearOverwatchFiltersButton: FC = () => {
  const { t } = useTranslation()
  const { onClick } = useComponent()
  return (
    <Button
      className={styles.clearButton}
      onClick={onClick}
    >
      {t('Clear all filters')}
    </Button>
  )
}

export default ClearOverwatchFiltersButton
