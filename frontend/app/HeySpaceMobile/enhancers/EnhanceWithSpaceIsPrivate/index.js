import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { selectProjectIsPrivate } from 'models/domain/ProjectsModel/selectors'

import BaseComponent from 'BaseComponent'

function enhance(ComposedComponent) {
  class EnhanceWithSpaceIsPrivate extends BaseComponent {

    static propTypes = {
      spaceId: PropTypes.string.isRequired,
      isPrivate: PropTypes.bool.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          spaceId={this.props.spaceId}
          isPrivate={this.props.isPrivate}
        />
      )
    }

  }

  const mapStateToProps = (state, props) => {
    return {
      isPrivate: selectProjectIsPrivate(state, { projectId: props.spaceId }),
    }
  }

  return connect(mapStateToProps)(EnhanceWithSpaceIsPrivate)
}

export default enhance
