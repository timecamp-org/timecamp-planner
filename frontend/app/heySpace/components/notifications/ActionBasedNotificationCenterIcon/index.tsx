import React from 'react'
import styles from './styles.css'

export type ActionBasedNotificationCenterIconInterface = {
  areThereUnreadNotifications: boolean,
  width?: number,
  height?: number,
}

export const ActionBasedNotificationCenterIcon: React.FC<ActionBasedNotificationCenterIconInterface> = ({ areThereUnreadNotifications, ...restProps }) => (
  <svg
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    x='0px'
    y='0px'
    viewBox='0 0 72.5 86.5'
    {...restProps}
    className={getClassName(areThereUnreadNotifications)}
  >
    {/* eslint-disable-next-line max-len */}
    <path d='M57.9,47.4V34c0-11.9-9.7-21.6-21.6-21.6h0c-11.9,0-21.6,9.7-21.6,21.6v13.4c0,2.7,0.7,12.7-4.8,12.7l0,0c-3.3,0-6,2.7-6,6l0,0c0,3.3,2.7,6,6,6h52.9c3.3,0,6-2.7,6-6l0,0c0-3.3-2.7-6-6-6l0,0C57.1,60.1,57.9,50.1,57.9,47.4z' />
    <path
      d='M29.3,72c-0.4,0.9-0.7,2-0.7,3.1c0,4.2,3.4,7.6,7.6,7.6c4.2,0,7.6-3.4,7.6-7.6c0-1.1-0.2-2.1-0.7-3.1H29.3z'
    />
    <path d='M36.2,12.4L36.2,12.4c1.4,0,2.7,0.1,4.1,0.4c0.8-0.9,1.3-2.1,1.3-3.5c0-3-2.4-5.3-5.3-5.3c-3,0-5.3,2.4-5.3,5.3c0,1.3,0.5,2.5,1.3,3.5C33.5,12.5,34.9,12.4,36.2,12.4z' />
  </svg>
)

function getClassName(areThereUnreadNotifications: boolean): string {
  if (areThereUnreadNotifications) {
    return styles.IconUnread
  } else {
    return styles.Icon
  }
}

export default ActionBasedNotificationCenterIcon
