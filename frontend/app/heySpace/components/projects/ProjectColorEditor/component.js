import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import { doNothing } from 'common/utils'
import ProjectColors from 'commonStyles/projectColors'
import ProjectColorDot from 'components/projects/ProjectColorDot/component'

ProjectColorEditor.propTypes = {
  projectId: PropTypes.string.isRequired,
  className: PropTypes.string,
  projectColor: PropTypes.string,
  isDisabled: PropTypes.bool,

  onColorUpdate: PropTypes.func,
  onBlur: PropTypes.func,
}

ProjectColorEditor.defaultProps = {
  isDisabled: false,
  onColorUpdate: doNothing,
  onBlur: doNothing,
}

function ProjectColorEditor(props) {
  return (
    <div
      className={props.className ? props.className : styles.Component}
      tabIndex={'-1'}
      onBlur={props.onBlur}
    >
      <div className={styles.colorOptions}>
        {ProjectColors.getProjectColors().map((color) => renderColorDot(color, props))}
      </div>
    </div>
  )
}

function renderColorDot(color, props) {
  return (
    <div
      key={color}
      className={props.isDisabled ? styles.disabledColorDotWrapper : styles.colorDotWrapper}
      onClick={() => props.onColorUpdate(color)}
    >
      <ProjectColorDot
        className={color === props.projectColor ? styles.selectedColorDot : styles.colorDot}
        innerClassName={styles.innerDot}
        projectColor={color}
        projectId={''}
        disabled={props.isDisabled}
        shouldRenderTick={color === props.projectColor}
        shouldRenderInnerRing={false}
      />
    </div>
  )
}

export default ProjectColorEditor
