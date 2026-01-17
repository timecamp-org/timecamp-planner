import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import getDefaultAppUrl from '../../utils/getDefaultAppUrl'
import { selectFirstProjectData } from 'models/domain/ProjectsModel/selectors/sortedAvailableVisibleSpacesIdsSelector'

function enhance(ComposedComponent) {
  class EnhanceWithAppDefaultUrl extends React.Component {

    static propTypes = {
      defaultUrl: PropTypes.string.isRequired,
    }

    render() {
      return (
        <ComposedComponent {...this.props} />
      )
    }

  }

  function mapStateToProps(state, props) {
    const firstProjectData = selectFirstProjectData(state)
    return {
      defaultUrl: getDefaultAppUrl({ firstProjectData }),
    }
  }

  return connect(mapStateToProps, undefined)(EnhanceWithAppDefaultUrl)
}

export default enhance
