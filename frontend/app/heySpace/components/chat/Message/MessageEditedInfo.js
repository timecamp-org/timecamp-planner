import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import { i18n } from 'i18n'

function MessageEditedInfo(props) {
  return <span className={props.className || styles.messageEditedInfo}>{i18n.t(' (edited)')}</span>
}

MessageEditedInfo.propTypes = {
  isEdited: PropTypes.bool,
}

export default (MessageEditedInfo)

