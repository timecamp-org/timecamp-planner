import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Rate, { AndroidMarket } from 'react-native-rate'
import DeviceInfo from 'react-native-device-info'

import RouteName from '../../../../AppNavigation/routeNames'

import BaseComponent from 'BaseComponent'

import { hasLoaded as hasLoadedSelector } from 'common/models/domain/AppModel/selectors'
import { selectSortedAvailableVisibleSpacesIds } from 'models/domain/ProjectsModel/selectors/sortedAvailableVisibleSpacesIdsSelector'
import { selectHasCurrentUserUnreadMessages } from 'models/domain/ProjectsModel/selectors'
import { selectHasCurrentUserUnreadNotifications } from 'models/domain/NotificationsModel/selectors'
import * as RequestTypes from 'models/domain/RequestModel/constants/requestTypes'
import { selectRequestIsSuccess } from 'models/domain/RequestModel/selectors'
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain'
import { getOrganizationProjectsQueryParams } from '../../../../projects/SpaceNavButtonList/dataHooks'
import { getRequestTypeWithParams } from 'common/models/domain/RequestModel/helpers'

import { timestampNow } from 'common/utils/epoch'
import {
  shouldShowRateUsModal,
  setLastReviewTimestamp,
  setLastDismissTimestamp,
  incrementAppOpenCount,
  SHOW_MODAL_TIMEOUT,
} from './utils'
import { NavigationService } from 'common/services'

const options = {
  // TODO: handle iOS version and AppStore options
  GooglePackageName: DeviceInfo.getBundleId(),
  preferredAndroidMarket: AndroidMarket.Google,
  preferInApp: false,
  openAppStoreIfInAppFails: true,
}

function enhance(ComposedComponent) {
  class EnhanceRateUsModal extends BaseComponent {

    static propTypes = {
      hasLoaded: PropTypes.bool,
    }

    state = {
      isVisible: false,
    }

    render() {
      return (
        <ComposedComponent
          isVisible={!!this.state.isVisible}

          onClose={this.onClose}
          onRate={this.onRate}
          onSendFeedback={this.onSendFeedback}
        />
      )
    }

    async onClose() {
      const timestamp = timestampNow()
      await setLastDismissTimestamp(timestamp)
      this.onHideModal()
    }

    onRate() {
      Rate.rate(options, async success => {
        if (success) {
          const timestamp = timestampNow()
          await setLastReviewTimestamp(timestamp)
          await setLastDismissTimestamp(null)
          this.onHideModal()
        }
      })
    }

    async onSendFeedback() {
      NavigationService.navigate(RouteName.SUPPORT)
      await this.onClose()
    }

    onShowModal() {
      this.setState({
        isVisible: true,
      })
    }

    onHideModal() {
      if (this.state.isVisible) {
        this.setState({
          isVisible: false,
        })
      }
    }

    async componentDidUpdate() {
      const {
        hasLoaded,
        firstProjectId,
        haveUnreadMessages,
        haveUnreadNotifications,
        hasUnreadNotificationsLoaded,
        hasUnreadMessagesLoaded,
      } = this.props
      const { isVisible } = this.state
      if (
        !isVisible
        && hasLoaded
        && hasUnreadNotificationsLoaded
        && hasUnreadMessagesLoaded
        && firstProjectId
        && !haveUnreadMessages
        && !haveUnreadNotifications
      ) {
        const shouldShow = await shouldShowRateUsModal()

        if (shouldShow) {
          if (!this.showModalTimeout) {
            this.showModalTimeout = setTimeout(this.onShowModal, SHOW_MODAL_TIMEOUT)
          }
        } else {
          this.onHideModal()
        }
      }
    }

    async componentDidMount() {
      await incrementAppOpenCount()
    }

    componentWillUnmount() {
      if (this.showModalTimeout) {
        clearTimeout(this.showModalTimeout)
      }
    }

  }

  const mapStateToProps = (state) => {
    const organizationId = selectCurrentOrganizationId(state)
    const organizationProjectsRequestType = getRequestTypeWithParams(RequestTypes.getOrganizationProjects, getOrganizationProjectsQueryParams)
    return {
      hasUnreadNotificationsLoaded: selectRequestIsSuccess(state, { requestType: RequestTypes.getUserUnreadNotifications, objectId: organizationId }),
      hasUnreadMessagesLoaded: selectRequestIsSuccess(state, { requestType: organizationProjectsRequestType, objectId: organizationId }),
      hasLoaded: hasLoadedSelector(state),
      firstProjectId: selectSortedAvailableVisibleSpacesIds(state).first(),
      haveUnreadMessages: selectHasCurrentUserUnreadMessages(state),
      haveUnreadNotifications: selectHasCurrentUserUnreadNotifications(state),
    }
  }

  return connect(mapStateToProps)(EnhanceRateUsModal)
}

export default enhance
