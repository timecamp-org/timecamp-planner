import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'

import { selectProjectName } from 'models/domain/ProjectsModel/selectors'

function Enhance(ComposedComponent) {
  class EnhanceProjectName extends BaseComponent {

    static propTypes = {
      projectId: PropTypes.string.isRequired,
      maxLength: PropTypes.number,
      styles: PropTypes.object,
    }

    render() {
      return (
        <ComposedComponent
          projectName={this.props.projectName}
          styles={this.props.styles}
          maxLength={this.props.maxLength}
        />
      )
    }

  }

  function mapStateToProps(state, props) {
    return {
      projectName: selectProjectName(state, { projectId: props.projectId }),
    }
  }

  return connect(mapStateToProps)(EnhanceProjectName)
}

export default Enhance
