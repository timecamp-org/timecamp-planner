import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { PushNotificationsClient } from 'common/services'
import { AppState } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import HumanMessage from 'models/domain/HumanMessageModel/model'
import { HumanMessageKinds } from 'models/domain/HumanMessageModel/types'

import BaseComponent from 'BaseComponent'

import * as AppModelActions from 'models/domain/AppModel/actions'
import * as AppModelSelectors from 'models/domain/AppModel/selectors'
import * as NotificationsModelActions from 'models/domain/NotificationsModel/actions'
import * as RequestTypes from 'models/domain/RequestModel/constants/requestTypes'
import { selectIsRequestFinished } from 'models/domain/RequestModel/selectors'
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain'
import onPushNotificationClicked from '../../../../utils/onPushNotificationClicked'
import { selectSortedAvailableVisibleSpacesIds } from 'models/domain/ProjectsModel/selectors/sortedAvailableVisibleSpacesIdsSelector'
import RouteName from '../../../AppNavigation/routeNames'
import * as PopUpAlertsModelActions from 'models/component/PopUpAlertsModel/actions'
import { i18n } from 'common/i18n'
import { selectIsWorkspaceMembersValidForSubscription } from 'models/domain/SubscriptionLimitsModel/selectors'
import { NavigationService } from 'common/services'
import { onSwitchOrganization } from 'models/domain/OrganizationsModel/actions'
import {
  onFetchProject,
} from 'models/domain/ProjectsModel/actions'
import { ProjectMetadataType } from 'models/domain/ProjectsModel/types'


function enhance(ComposedComponent) {
  class EnhanceAppController extends BaseComponent {

    constructor(props) {
      super(props)
      if (!this.props.hasLoaded) {
        this.props.onInit()
      }
    }

    static propTypes = {
      onInit: PropTypes.func.isRequired,
    }

    state = {
      appState: AppState.currentState,
    }

    render() {
      return <ComposedComponent {...this.props} />
    }

    onAppStateChange(nextAppState) {
      this.setState({
        appState: nextAppState,
        scene: NavigationService.getCurrentRouteName(),
        initialNotification: null
      })
    }

    onConnectionChange({ isConnected }) {
      if (this.previousIsConnected === false && isConnected) {
        this.onAppIsOnline()
      }

      if (this.previousIsConnected && !isConnected) {
        this.onAppIsOffline()
      }

      this.previousIsConnected = isConnected
    }

    onAppIsOffline() {
      this.props.onAddAlert({
        humanMessage: HumanMessage({
          kind: HumanMessageKinds.warning,
          text: i18n.t(`Your phone seems to be offline. We are trying to reconnect...`),
        })
      }, 'OfflineError')
    }

    onAppIsOnline() {
      this.props.onAddAlert({
        humanMessage: HumanMessage({
          kind: HumanMessageKinds.information,
          text: i18n.t(`Reconnecting...`),
        }),
      }, 'app-refreshing')
    }

    onNotificationsSubscriptionChange(newToken) {
      if (newToken) {
        this.props.onUnmutePushNotifications()
      } else {
        this.props.onSetCurrentDeviceId()
      }
    }

    componentDidUpdate(prevProps, prevState) {
      if (!prevProps.hasLoaded && this.props.hasLoaded) {
        PushNotificationsClient.onTokenRefresh(this.onNotificationsSubscriptionChange)
      }
      if (this.props.hasLoaded) {
        if (this.state.initialNotification) {
          const notificationData = this.state.initialNotification.notification.data
          const { organizationId, data } = notificationData
          const parsedData = JSON.parse(data)

          const { projectId } = parsedData

          if (organizationId && organizationId !== this.props.currentOrganizationId) {
            this.props.onSwitchOrganization(organizationId)
          }
          if (projectId) {
            this.props.onFetchProject(projectId)
          }

          onPushNotificationClicked(notificationData)
          this.setState({ initialNotification: null })
        }
        const shouldRedirectToExpiredSubscription = prevProps.isWorkspaceMembersValidForSubscription && !this.props.isWorkspaceMembersValidForSubscription && !this.props.isOrganizationPeopleLoading
        if (shouldRedirectToExpiredSubscription) {
          NavigationService.navigate(RouteName.SUBSCRIPTION_EXPIRED)
        }
      }
    }

    async componentDidMount() {
      AppState.addEventListener('change', this.onAppStateChange)
      this.unsubscribeFromNetInfo = NetInfo.addEventListener(this.onConnectionChange)

      const initialNotification = await PushNotificationsClient.getInitialNotification()
      this.setState({ initialNotification })
    }

    componentWillUnmount() {
      AppState.removeEventListener('change', this.onAppStateChange)
      if (this.unsubscribeFromNetInfo) {
        this.unsubscribeFromNetInfo()
      }
    }
  }

  const mapStateToProps = (state) => {
    const currentOrganizationId = selectCurrentOrganizationId(state)
    return {
      currentOrganizationId,
      hasLoaded: AppModelSelectors.hasLoaded(state),
      isOrganizationPeopleLoading: !selectIsRequestFinished(state, { requestType: RequestTypes.getOrganizationPeople, objectId: currentOrganizationId }),
      isWorkspaceMembersValidForSubscription: selectIsWorkspaceMembersValidForSubscription(state),
    }
  }

  const mapDispatchToProps = (dispatch, props) => ({
    onInit: () => dispatch(AppModelActions.onInit()),
    onInitModels: () => dispatch(AppModelActions.onInitModels()),
    onSetCurrentDeviceId: (deviceId) => dispatch(NotificationsModelActions.onSetCurrentDeviceId(deviceId)),
    onUnmutePushNotifications: () => dispatch(NotificationsModelActions.onUnmutePushNotifications()),
    onAddAlert: (alert, id) => dispatch(PopUpAlertsModelActions.onAddAlert(alert, id)),
    onSwitchOrganization: (organizationId) => dispatch(onSwitchOrganization(organizationId, true, false)),
    onFetchProject: (projectId) => dispatch(onFetchProject(projectId, { metadata: [ProjectMetadataType.PEOPLE] })),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceAppController)
}

export default enhance
