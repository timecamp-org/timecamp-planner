import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import RedirectToNewWorkspacePage from 'components/routing/RedirectTo/newWorkspacePage'

import { selectCurrentUserExistingOrganizationIds } from 'models/domain/UsersModel/selectors'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import {
  selectIsRequestFinished,
  selectRequestIsFailure,
} from 'models/domain/RequestModel/selectors'
import OfflinePageWithRetryButton from 'components/auth/OfflinePageWithRetryButton/base'


import * as RequestTypesConstants from 'models/domain/RequestModel/constants/requestTypes'


function enhance(ComposedComponent) {
  class RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces extends React.Component {

    static propTypes = {
      match: PropTypes.shape({
        url: PropTypes.string,
      }),
    }

    static defaultProps = {
    }

    render() {
      if (this.props.currentUserOrganizationIds.size > 0 || this.props.isLoading) {
        return (
          <ComposedComponent
            {...this.props}
          />
        )
      } else if (this.props.isFailed) {
        return (
          <OfflinePageWithRetryButton />
        )
      } else {
        return (
          <RedirectToNewWorkspacePage />
        )
      }
    }
  }

  function mapStateToProps(state) {
    const currentUserId = selectCurrentUserId(state)
    return {
      isLoading: !selectIsRequestFinished(state, { requestType: RequestTypesConstants.getUserInitialData, objectId: currentUserId }),
      isFailed: selectRequestIsFailure(state, { requestType: RequestTypesConstants.getUserInitialData, objectId: currentUserId }),
      currentUserOrganizationIds: selectCurrentUserExistingOrganizationIds(state),
    }
  }

  return connect(mapStateToProps)(RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces)
}

export default enhance
