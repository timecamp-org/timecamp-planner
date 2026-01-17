import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import { selectRequestStatus } from 'models/domain/RequestModel/selectors'
import * as RequestTypesConstants from 'models/domain/RequestModel/constants/requestTypes'
import { RequestStatus } from 'models/domain/RequestModel/types'
import { NavigationService } from 'common/services'
import RouteName from 'components/AppNavigation/routeNames'

function enhance(ComposedComponent) {
  class EnhanceCreateWorkspaceModal extends BaseComponent {

    static propTypes = {
      onClose: PropTypes.func.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
        />
      )
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
      if (prevProps.creatWorkspaceStatus === RequestStatus.LOADING && this.props.creatWorkspaceStatus === RequestStatus.SUCCESS) {
        this.props.onClose()
        NavigationService.reset(RouteName.PROJECT_LOADER)
      }
    }

  }

  const mapStateToProps = (state, props) => ({
    creatWorkspaceStatus: selectRequestStatus(state, { requestType: RequestTypesConstants.createWorkspace, objectId: null }),

  })

  return connect(mapStateToProps)(EnhanceCreateWorkspaceModal)
}

export default enhance
