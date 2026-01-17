import React from 'react'
import styles from './styles.css'

export type NotificationsLoadingInterface = {
  className?: string,
  message: string,
}

const NotificationsLoading: React.FC<NotificationsLoadingInterface> = (props) => (
  <div className={props.className ? props.className : styles.Component}>
    <div>{props.message}</div>
    <span className={styles.ellipsis}><span>.</span><span>.</span><span>.</span></span>
  </div>
)

export default NotificationsLoading
