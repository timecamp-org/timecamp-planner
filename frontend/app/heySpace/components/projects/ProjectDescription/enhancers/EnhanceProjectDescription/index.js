import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { selectProjectDescription } from 'models/domain/ProjectsModel/selectors'

export default function enhance(ComposedComponent) {
  class EnhanceProjectDescription extends React.Component {
    static propTypes = {
      projectId: PropTypes.string,
      description: PropTypes.string,
    }

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          placeholder={this.props.placeholder}
          description={this.props.description}
        />
      )
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      description: selectProjectDescription(state, { projectId: props.projectId }),
    }
  }

  return connect(mapStateToProps, undefined)(EnhanceProjectDescription)
}
