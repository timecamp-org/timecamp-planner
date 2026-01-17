import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import RedirectToWorkspaceInvitationPage from 'components/routing/RedirectTo/workspaceInvitationsPage'

import { selectCurrentUserExistingOrganizationIds } from 'models/domain/UsersModel/selectors'

function enhance(ComposedComponent) {
  class RedirectToWorkspaceInvitationsIfCurrentUserHasWorkspaces extends React.Component {

    static propTypes = {
      match: PropTypes.shape({
        url: PropTypes.string,
      }),
    }

    static defaultProps = {
    }

    render() {
      if (this.props.currentUserOrganizationIds.size === 0) {
        return (
          <ComposedComponent
            {...this.props}
          />
        )
      } else {
        return (
          <RedirectToWorkspaceInvitationPage />
        )
      }
    }
}

  function mapStateToProps(state) {
    return {
      currentUserOrganizationIds: selectCurrentUserExistingOrganizationIds(state),
    }
  }

  return connect(mapStateToProps)(RedirectToWorkspaceInvitationsIfCurrentUserHasWorkspaces)
}

export default enhance
