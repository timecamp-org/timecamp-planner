import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import ClientThumbnail from 'components/settings/developerConsole/ClientThumbnail'
import { doNothing } from 'common/utils'

MyApp.propTypes = {
  className: PropTypes.string,
  clientName: PropTypes.string,
  clientThumbnailUrl: PropTypes.string,
  onClick: PropTypes.func,
}

MyApp.defaultProps = {
  className: '',
  clientName: '',
  onClick: doNothing,
}

function MyApp(props) {
  return (
    <div
      className={styles.Component}
      onClick={props.onClick}
    >
      <ClientThumbnail
        clientName={props.clientName}
        clientThumbnailUrl={props.clientThumbnailUrl}
      />
      <div className={styles.title}>
        {props.clientName}
      </div>
    </div>
  )
}

export default MyApp
