import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'


import { selectProjectColor } from 'models/domain/ProjectsModel/selectors'

function Enhance(ComposedComponent) {
  class EnhanceWithProjectColor extends React.Component { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      // needs
      projectId: PropTypes.string.isRequired,
      className: PropTypes.string,
      disabled: PropTypes.bool,

      // injects
      projectColor: PropTypes.string,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          className={this.props.className}
          projectId={this.props.projectId}
          projectColor={this.props.projectColor}
          disabled={this.props.disabled}
          color={this.props.projectColor}
        />
      )
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      projectColor: selectProjectColor(state, { projectId: props.projectId }),
    }
  }

  return connect(mapStateToProps)(EnhanceWithProjectColor)
}

export default Enhance
