import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import { i18n, i18mark } from 'i18n'

ProjectDescription.propTypes = {
  className: PropTypes.string,
  description: PropTypes.string,
  placeholder: PropTypes.string,
}

ProjectDescription.defaultProps = {
  className: '',
  description: '',
  placeholder: i18mark('Define project goal here'),
}

function ProjectDescription(props) {
  return (
    <span className={props.className || styles.Component}>
      {props.description || i18n.t(props.placeholder)}
    </span>
  )
}

export default ProjectDescription
