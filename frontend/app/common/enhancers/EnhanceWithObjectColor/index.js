import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { selectTaskColor } from '../../models/domain/TasksModel/selectors'
import { selectProjectColor } from '../../models/domain/ProjectsModel/selectors'
import { selectEntityType } from '../../models/domain/EntityModel/selectors'
import { EntityType } from '../../models/domain/EntityModel/types'

function Enhance(ComposedComponent) {
  class EnhanceWithObjectColor extends React.Component { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      // needs
      objectId: PropTypes.string.isRequired,

      // injects
      color: PropTypes.string,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          color={this.props.color}
        />
      )
    }

  }

  const mapStateToProps = (state, props) => {
    const objectType = selectEntityType(state, { entityId: props.objectId })
    const color = objectType === EntityType.TASK_DATA
      ? selectTaskColor(state, { taskId: props.objectId })
      : selectProjectColor(state, { projectId: props.objectId })

    return { color }
  }

  return connect(mapStateToProps)(EnhanceWithObjectColor)
}

export default (Enhance)
