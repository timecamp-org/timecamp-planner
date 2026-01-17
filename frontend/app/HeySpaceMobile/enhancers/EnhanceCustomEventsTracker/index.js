import React from 'react'
import { connect } from 'react-redux'
import { AppEventEmitter } from 'common/services'
import onPushNotificationClicked from '../../utils/onPushNotificationClicked'
import * as AppModelActions from 'models/domain/AppModel/actions'
import BaseComponent from 'BaseComponent'
import { AppEventType } from 'common/types'
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain'
import * as AppModelSelectors from 'models/domain/AppModel/selectors'
import * as RequestModelActions from 'common/models/domain/RequestModel/actions'
import * as PaginationModelActions from 'common/models/domain/PaginationModel/actions'
import { onSwitchOrganization } from 'common/models/domain/OrganizationsModel/actions'
import {
  onFetchProject,
} from 'models/domain/ProjectsModel/actions'

function Enhance(ComposedComponent) {
  class EnhanceCustomEventsTracker extends BaseComponent {

    render() {
      return <ComposedComponent {...this.props} />
    }

    handleAppReconnected() {
      this.props.onInitModels()
      this.props.onClearPaginationState()
      this.props.onSetDirtyRequests()
    }

    onPushNotificationClickedListener(notification) {
      if (this.props.hasLoaded) {
        if (!notification) {
          return
        }
        const { organizationId, data } = notification
        const parsedData = JSON.parse(data)

        if (organizationId && organizationId !== this.props.currentOrganizationId) {
          this.props.onSwitchOrganization(organizationId)
        }

        if (parsedData.projectId) {
          this.props.onFetchProject(parsedData.projectId)
        }

        onPushNotificationClicked(notification)
        this.clickedNotification = null
      } else {
        this.clickedNotification = notification
      }
    }

    componentDidMount() {
      AppEventEmitter.on(AppEventType.PUSH_NOTIFICATION_CLICKED, this.onPushNotificationClickedListener)
      AppEventEmitter.on(AppEventType.APP_RECONNECTED, this.handleAppReconnected)
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
      if (this.props.hasLoaded && this.clickedNotification) {
        onPushNotificationClicked(this.clickedNotification)
        this.clickedNotification = null
      }
    }


    componentWillUnmount() {
      AppEventEmitter.off(AppEventType.PUSH_NOTIFICATION_CLICKED, this.onPushNotificationClickedListener)
      AppEventEmitter.off(AppEventType.APP_RECONNECTED, this.handleAppReconnected)
    }

  }

  const mapStateToProps = (state, props) => {
    const currentOrganizationId = selectCurrentOrganizationId(state)
    return {
      currentOrganizationId,
      hasLoaded: AppModelSelectors.hasLoaded(state),
    }
  }


  const mapDispatchToProps = (dispatch, props) => ({
    onInitModels: () => dispatch(AppModelActions.onInitModels()),
    onSetDirtyRequests: () => dispatch(RequestModelActions.onSetDirtyRequests()),
    onClearPaginationState: () => dispatch(PaginationModelActions.onClearState()),
    onSwitchOrganization: (organizationId) => dispatch(onSwitchOrganization(organizationId, true, false)),
    onFetchProject: (projectId) => dispatch(onFetchProject(projectId, { metadata: 'projectPeople'})),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceCustomEventsTracker)
}


export default Enhance
