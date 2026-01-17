import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import { selectCurrentUserExistingOrganizationIds } from 'models/domain/UsersModel/selectors'
import { selectCurrentOrganizationId, selectAllOrganizationNames } from 'models/domain/OrganizationsModel/selectors/domain'
import { onSwitchOrganization } from 'models/domain/OrganizationsModel/actions'
import { NavigationService } from 'common/services'
import RouteName from 'components/AppNavigation/routeNames'

function enhance(ComposedComponent) {
  class EnhancerWorkspaceManagement extends BaseComponent {

    static propTypes = {
      organizationIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
    }

    state = {
      isCreateModalOpen: false,
    }

    render() {
      return (
        <ComposedComponent
          isCreateModalOpen={this.state.isCreateModalOpen}
          organizationIds={this.props.organizationIds}
          onSetIsCreateWorkspaceModalOpen={this.onSetIsCreateWorkspaceModalOpen}
        />
      )
    }

    onSetIsCreateWorkspaceModalOpen(isOpen) {
      this.setState({
        isCreateModalOpen: isOpen,
      })
    }

  }

  const mapStateToProps = (state, props) => ({
    organizationIds: selectCurrentUserExistingOrganizationIds(state),
  })


  return connect(mapStateToProps)(EnhancerWorkspaceManagement)
}

export default enhance
