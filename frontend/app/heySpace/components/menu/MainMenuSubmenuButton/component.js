import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'

import { doNothing } from 'common/utils'

MainMenuSubmenuButton.propTypes = {
  className: PropTypes.string,
  iconClassName: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  iconSize: PropTypes.number,
  text: PropTypes.string,
  onClick: PropTypes.func,
}

MainMenuSubmenuButton.defaultProps = {
  className: '',
  iconClassName: '',
  iconSize: 24,
  text: '',
  onClick: doNothing,
}

function MainMenuSubmenuButton(props) {
  const Icon = props.icon
  return (
    <div className={`${styles.MainMenuSubmenuButton} ${props.className}`} onClick={props.onClick}>
      <Icon size={props.iconSize} className={`${styles.icon} ${props.iconClassName}`} />
      <div className={styles.text}>{props.text}</div>
    </div>
  )
}

export default MainMenuSubmenuButton