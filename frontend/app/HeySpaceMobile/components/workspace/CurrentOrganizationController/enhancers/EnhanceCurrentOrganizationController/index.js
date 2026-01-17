import React from 'react'
import { connect } from 'react-redux'

import { EntityStatus } from 'models/domain/EntityModel/types'
import {
  selectCurrentUserStatusInCurrentOrganization,
  selectOrganizationOwnerEmail,
} from 'models/domain/OrganizationsModel/selectors'

import { 
  selectCurrentUserExistingOrganizationIds
} from 'models/domain/UsersModel/selectors'

import {
  selectCurrentOrganizationId,
  selectCurrentOrganizationName,
} from 'models/domain/OrganizationsModel/selectors/domain'
import { onSwitchOrganization } from 'models/domain/OrganizationsModel/actions'
import RouteName from 'components/AppNavigation/routeNames'

import BaseComponent from 'BaseComponent'
import { selectCurrentOrganizationStatus } from 'models/domain/OrganizationsModel/selectors/domain';
import { NavigationService } from 'common/services'

function enhance(ComposedComponent) {
  class EnhancedCurrentOrganizationController extends BaseComponent {

    state = {
      isOrganizationArchived: false,
    }

    render() {
      return (
        <ComposedComponent
          isOrganizationArchived={this.state.isOrganizationArchived}
          currentOrganizationName={this.props.currentOrganizationName}

          ownerEmail={this.props.ownerEmail}
          onRedirectFromThisWorkspace={this.onRedirectFromThisWorkspace}
        />
      )
    }

    onRedirectFromThisWorkspace() {
      const { currentOrganizationId } = this.props
      const organizationIds = this.props.organizationIds.filter(organizationId => organizationId !== currentOrganizationId)
      if (organizationIds.isEmpty()) {
        NavigationService.navigate(RouteName.CREATE_NEW_WORKSPACE)
      } else {
        const nextOrganizationId = organizationIds.first()
        this.props.onSwitchOrganization(nextOrganizationId)
      }

      this.setState({
        isOrganizationArchived: false,
      })
    }

    componentDidUpdate(prevProps) {
      if (prevProps.currentOrganizationStatus === EntityStatus.EXISTS && this.props.currentOrganizationStatus === EntityStatus.ARCHIVED) {
        this.setState({
          isOrganizationArchived: true,
        })
      }
    }

    componentDidMount() {
      if (this.props.currentOrganizationStatus === EntityStatus.ARCHIVED) {
        this.setState({
          isOrganizationArchived: true,
        })
      }
    }

  }

  const mapStateToProps = (state) => ({
    userStatus: selectCurrentUserStatusInCurrentOrganization(state),
    ownerEmail: selectOrganizationOwnerEmail(state),

    organizationIds: selectCurrentUserExistingOrganizationIds(state),
    currentOrganizationId: selectCurrentOrganizationId(state),
    currentOrganizationName: selectCurrentOrganizationName(state),
    currentOrganizationStatus: selectCurrentOrganizationStatus(state),
  })

  const mapDispatchToProps = (dispatch) => ({
    onSwitchOrganization: (id) => dispatch(onSwitchOrganization(id)),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhancedCurrentOrganizationController)
}

export default enhance
