import React from 'react'
import { i18mark } from 'i18n'
import styles from './styles.css'

export type EmptyNotificationsListInterface = {
  className?: string,
  title?: string,
  message?: string,
}

const defaultProps: EmptyNotificationsListInterface = {
  title: i18mark('Nothing here yet'),
  message: i18mark('Your notifications will show up here.'),
}

export const EmptyNotificationsList: React.FC<EmptyNotificationsListInterface> = (props) => (
  <div className={props.className || styles.Component}>
    <div className={styles.mascot} />
    <div className={styles.title}>
      {props.title}
    </div>
    <div className={styles.message}>
      {props.message}
    </div>
  </div>
)

EmptyNotificationsList.defaultProps = defaultProps

export default EmptyNotificationsList
