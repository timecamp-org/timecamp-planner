//@ts-nocheck
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import createLinkFromNotification from 'common/utils/notifications/createLinkFromNotification';
import { NotificationExternalData } from '../../../../../../common/models/domain/NotificationsModel/models';
import * as AppModelActions from 'models/domain/AppModel/actions';
import { AppEventEmitter } from 'common/services';
import { AppEventType } from 'common/types';
import * as RequestModelActions from 'models/domain/RequestModel/actions';
import * as PaginationModelActions from 'models/domain/PaginationModel/actions';
import { selectIsUserIdle, selectIsPageVisible } from 'models/domain/AppModel/selectors';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';
import { onSwitchOrganization } from 'models/domain/OrganizationsModel/actions';
import isString from 'lodash/isString';
import getSpaceUrl from '../../../../../utils/getSpaceUrl';
import BaseComponent from 'commonEnhancers/BaseComponent';
import EnhanceWithRouter from 'enhancers/EnhanceWithRouter';
import { selectSortedAvailableVisibleSpacesIds } from 'models/domain/ProjectsModel/selectors/sortedAvailableVisibleSpacesIdsSelector';

function Enhance(ComposedComponent) {
  @EnhanceWithRouter()
  class EnhanceAppEventsTracker extends BaseComponent {
    static propTypes = {
      history: PropTypes.object.isRequired,
    };

    render() {
      return <ComposedComponent />;
    }

    onPushNotificationClicked(notification) {
      if (!notification) {
        return;
      }
      const { notificationType, data, organizationId } = notification;

      if (organizationId && organizationId !== this.props.currentOrganizationId) {
        this.props.onSwitchOrganization(organizationId);
      }

      const parsedData = isString(data) ? JSON.parse(data) : data;

      const link = createLinkFromNotification({
        notificationType: parseInt(notificationType),
        notificationData: new NotificationExternalData(parsedData),
      });

      if (parsedData && parsedData.taskId) {
        this.props.onOpenCardDetailsModal(parsedData.taskId);
      } else if (link) {
        this.props.onCloseCardDetailsModal();
        this.props.history.push(link);
      }
    }

    handleAppReconnected() {
      this.sheduledReconnect = true;
      const isUserActive = !this.props.isUserIdle && this.props.isPageVisible;
      if (isUserActive) {
        this.onFetchData();
      } else {
        this.props.onInitBackgroundResources();
      }
    }

    handleRemoveProjectMember({ projectId, userId }) {
      const { location, currentUserId, firstVisibleProjectId } = this.props;
      if (location?.pathname.includes(projectId) && userId === currentUserId) {
        this.props.history.replace(getSpaceUrl(firstVisibleProjectId));
      }
    }

    onFetchData() {
      this.sheduledReconnect = false;
      this.props.onClearPaginationState();
      this.props.onSetDirtyRequests();
      this.props.onInitModels();
    }

    handleAppRefresh() {
      this.sheduleAppRefresh = true;
      if (!this.props.isUserIdle && this.props.isPageVisible) {
        this.onRefreshApp();
      }
    }

    onRefreshApp() {
      this.sheduleAppRefresh = false;
      window.location.reload();
    }

    componentDidMount() {
      AppEventEmitter.on(AppEventType.PUSH_NOTIFICATION_CLICKED, this.onPushNotificationClicked);
      AppEventEmitter.on(AppEventType.APP_RECONNECTED, this.handleAppReconnected);
      AppEventEmitter.on(AppEventType.REMOVE_PROJECT_MEMBER, this.handleRemoveProjectMember);
      AppEventEmitter.once(AppEventType.APP_REFRESH, this.handleAppRefresh);
    }

    componentWillUnmount() {
      AppEventEmitter.off(AppEventType.PUSH_NOTIFICATION_CLICKED, this.onPushNotificationClicked);
      AppEventEmitter.off(AppEventType.APP_RECONNECTED, this.handleAppReconnected);
      AppEventEmitter.off(AppEventType.REMOVE_PROJECT_MEMBER, this.handleRemoveProjectMember);
      AppEventEmitter.off(AppEventType.APP_REFRESH, this.handleAppRefresh);
    }

    componentDidUpdate() {
      if (!this.props.isUserIdle && this.props.isPageVisible) {
        if (this.sheduleAppRefresh) {
          this.onRefreshApp();
        }
        if (this.sheduledReconnect) {
          this.onFetchData();
        }
      }
    }
  }

  function mapStateToProps(state) {
    return {
      isUserIdle: selectIsUserIdle(state),
      isPageVisible: selectIsPageVisible(state),
      currentOrganizationId: selectCurrentOrganizationId(state),
      currentUserId: selectCurrentUserId(state),
      firstVisibleProjectId: selectSortedAvailableVisibleSpacesIds(state).first(),
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      onOpenCardDetailsModal: (taskId) => dispatch(AppModelActions.onSetOpenedCardDetailsModalId(taskId)),
      onCloseCardDetailsModal: () => dispatch(AppModelActions.onSetOpenedCardDetailsModalId(null)),
      onClearRequestsState: () => dispatch(RequestModelActions.onClearState()),
      onSetDirtyRequests: () => dispatch(RequestModelActions.onSetDirtyRequests()),
      onClearPaginationState: () => dispatch(PaginationModelActions.onClearState()),
      onInitModels: () => dispatch(AppModelActions.onInitModels()),
      onInitBackgroundResources: () => dispatch(AppModelActions.onInitBackgroundResources()),
      onSwitchOrganization: (organizationId) => dispatch(onSwitchOrganization(organizationId)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceAppEventsTracker);
}

export default Enhance;
