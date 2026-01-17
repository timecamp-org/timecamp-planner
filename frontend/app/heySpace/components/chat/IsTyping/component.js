import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'immutable-prop-types'
import styles from './styles.css'
import { List } from 'immutable'

import PersonFullName from 'components/person/PersonFullName'
import { useTranslation } from 'i18n'

const MAX_PEOPLE_TO_SHOW = 3

IsTyping.propTypes = {
  isTyping: PropTypes.bool,
  userIds: ImmutablePropTypes.list,
}

IsTyping.defaultProps = {
  isTyping: false,
  userIds: new List(),
}

function IsTyping(props) {
  const { t } = useTranslation()
  return (
    <div
      className={`${styles.Component}`}
    >
      {props.isTyping
        ? renderIsTyping(props, t)
        : null
      }
    </div>
  )
}

function renderIsTyping({ userIds }, t) {
  if (userIds.size === 1) {
    return (
      <Fragment>
        <PersonFullName userId={userIds.first()} className={styles.typingUser}/>
        <span>{t(' is typing…')}</span>
      </Fragment>
    )
  } else if (userIds.size > 1 && userIds.size <= MAX_PEOPLE_TO_SHOW) {
    return (
      <Fragment>
        {userIds.map(renderTypingUser)}
        {t(' are typing…')}
      </Fragment>
    )
  } else {
    return t('several people are typing…')
  }

  function renderTypingUser(userId) {
    const isLastUserId = userId === userIds.last()
    return <Fragment key={`Typing_${userId}`}>
      <PersonFullName userId={userId} className={styles.typingUser}/>
      {isLastUserId ? null : t(' and ')}
    </Fragment>
  }
}

export default IsTyping
