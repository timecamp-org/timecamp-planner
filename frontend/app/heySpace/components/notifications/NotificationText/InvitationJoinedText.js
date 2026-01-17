import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import { useTranslation } from 'i18n'

InvitationJoinedText.propTypes = {
  className: PropTypes.string,
  actorId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  userValue: PropTypes.string.isRequired,
  projectId: PropTypes.string,
}

InvitationJoinedText.defaultProps = {
}

function InvitationJoinedText(props) {
  const { t } = useTranslation()
  return (
    <div className={props.className ? props.className : styles.Component} onClick={props.onClick}>
      <span className={styles.textElement}>{t(`notification|{{userEmail}} joined your WorkSpace using your shared link.`, { userEmail: props.userValue })}</span>
    </div>
  )
}

export default InvitationJoinedText
