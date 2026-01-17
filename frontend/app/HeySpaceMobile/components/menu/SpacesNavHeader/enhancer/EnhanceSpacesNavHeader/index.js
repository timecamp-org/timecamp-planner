import React from 'react'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import RouteName from '../../../../AppNavigation/routeNames'
import isIOS from '../../../../../utils/isIOS'

export const CREATE_SPACE_MODAL = 'createSpaceModal'
export const BROWSE_SPACES_MODAL = 'browseSpacesModal'
import { selectIsCurrentUserOrganizationGuest } from 'models/domain/OrganizationsModel/selectors'
import { NavigationService } from 'common/services'

function enhance(ComposedComponent) {
  class EnhanceSpacesNavHeader extends BaseComponent {

    state = {
      openedModalType: null,
    }

    render() {
      return (
        <ComposedComponent
          openedModalType={this.state.openedModalType}
          canCurrentUserCreateProject={this.props.canCurrentUserCreateProject}
          onOpenBrowseSpacesModal={this.onOpenBrowseSpacesModal}
          onCloseBrowseSpacesModal={this.onCloseBrowseSpacesModal}
          onOpenCreateSpaceModal={this.onOpenCreateSpaceModal}
          onCloseCreateSpaceModal={this.onCloseCreateSpaceModal}
          onSetIsModalOpened={this.onSetIsModalOpened}
        />
      )
    }

    onSetIsModalOpened(isOpened, modalType) {
      this.setState(prevState => {
        if (isOpened) {
          return {
            openedModalType: modalType,
          }
        } else if (modalType === prevState.openedModalType) {
          return {
            openedModalType: null,
          }
        } else {
          return {}
        }
      })
    }

    onOpenBrowseSpacesModal() {
      this.onSetIsModalOpened(true, BROWSE_SPACES_MODAL)
    }

    onCloseBrowseSpacesModal() {
      this.onSetIsModalOpened(false, BROWSE_SPACES_MODAL)
    }

    onOpenCreateSpaceModal() {
      if (isIOS) {
        NavigationService.navigate(RouteName.CREATE_SPACE)
      } else {
        this.onSetIsModalOpened(true, CREATE_SPACE_MODAL)
      }
    }

    onCloseCreateSpaceModal() {
      this.onSetIsModalOpened(false, CREATE_SPACE_MODAL)
    }

  }

  function mapStateToProps(state) {
    return {
      canCurrentUserCreateProject: !selectIsCurrentUserOrganizationGuest(state),
    }
  }

  return connect(mapStateToProps)(EnhanceSpacesNavHeader)
}

export default enhance
