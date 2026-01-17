import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import { useTranslation } from 'i18n'

FileUploadLoaderBar.propTypes = {
  fileName: PropTypes.string,
  progress: PropTypes.number,
}

FileUploadLoaderBar.defaultProps = {
  fileName: '',
  progress: 0,
}

function FileUploadLoaderBar(props) {
  const { t } = useTranslation()
  return (
    <div className={styles.bar}>
      <div className={styles.progress} style={{ width: `${props.progress}%` }}></div>
      <div className={styles.textContainer}>
        <span className={styles.text}>{t(`Uploading a file: `, { fileName: props.fileName })}</span>
        {
          props.progress > 0
            ? <span className={styles.text}>{t(`Progress: {{progress}}%`, { progress: Math.round(props.progress) })}</span>
            : <span className={styles.text}>{t(`Processing file`)}</span>
        }
      </div>
    </div>
  )
}

export default FileUploadLoaderBar
