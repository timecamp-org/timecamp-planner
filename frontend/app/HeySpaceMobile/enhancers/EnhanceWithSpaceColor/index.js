import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { selectProjectColor } from 'models/domain/ProjectsModel/selectors'

import BaseComponent from 'BaseComponent'

function enhance(ComposedComponent) {
  class EnhanceWithSpaceColor extends BaseComponent {

    static propTypes = {
      spaceId: PropTypes.string.isRequired,
      spaceColor: PropTypes.string.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          spaceId={this.props.spaceId}
          spaceColor={this.props.spaceColor}
        />
      )
    }

  }

  const mapStateToProps = (state, props) => {
    return {
      spaceColor: selectProjectColor(state, { projectId: props.spaceId }),
    }
  }

  return connect(mapStateToProps)(EnhanceWithSpaceColor)
}

export default enhance
