import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'i18n'
import { doNothing } from 'common/utils'

import MyApps from 'components/settings/developerConsole/MyApps'

import styles from './styles.css'

DeveloperConsolePage.propTypes = {
  className: PropTypes.string,

}

DeveloperConsolePage.defaultProps = {
  className: '',

}

function DeveloperConsolePage(props) {
  return (
    <div className={styles.Component}>
      <MyApps />
    </div>
  )
}

export default DeveloperConsolePage
