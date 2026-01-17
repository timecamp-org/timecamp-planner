import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'

import * as NotificationsModelActions from 'models/domain/NotificationsModel/actions'
import * as NotificationsModelSelectors from 'models/domain/NotificationsModel/selectors'
import { selectHasMoreToLoad } from 'models/domain/PaginationModel/selectors'
import { selectRequestIsLoading, selectIsRequestFinished } from 'models/domain/RequestModel/selectors'
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain'

import { getUserNotifications } from 'models/domain/RequestModel/constants/requestTypes'
import { NotificationCenterType } from 'models/domain/NotificationsModel/types'

import BaseComponent from 'BaseComponent'
import EnhanceWithRefreshData from 'common/enhancers/EnhanceWithRefreshData'

const MINIMUM_RESULTS_TO_FETCH = 20

function Enhance(ComposedComponent) {
  @EnhanceWithRefreshData({
    action: NotificationsModelActions.onFetchNotifications,
    paramsToInject: [
      { key: 'limit', defaultValue: MINIMUM_RESULTS_TO_FETCH },
      { key: 'isArchived', defaultValue: false },
      { key: 'force', defaultValue: true },
    ],
  })
  class EnhanceNotificationsCenterScene extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      className: PropTypes.string,
      notificationIds: ImmutablePropTypes.list.isRequired,
      onFetchNotifications: PropTypes.func.isRequired,
    }

    state = {
      isNextPageLoading: false,
    }

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          notificationIds={this.props.notificationIds}
          isNextPageLoading={this.state.isNextPageLoading}
          isLoading={this.props.isLoading}
          hasMoreToLoad={this.props.hasMoreToLoad}

          onLoadMore={this.onLoadMore}
          onEndReached={this.onEndReached}
        />
      )
    }

    onLoadMore() {
      if (this.props.hasMoreToLoad && !this.props.isLoading && !this.state.isNextPageLoading) {
        this.setState({
          isNextPageLoading: true,
        })
        this.props.onFetchNotifications(MINIMUM_RESULTS_TO_FETCH)
      }
    }


    onEndReached() {
      this.onLoadMore()
    }


    componentDidUpdate(prevProps) {
      if (prevProps.isLoading && !this.props.isLoading) {
        this.setState({
          isNextPageLoading: false,
        })
      }
      if (this.props.notificationIds.size < MINIMUM_RESULTS_TO_FETCH && !this.props.isLoading) {
        this.onLoadMore()
      }
    }

    componentDidMount() {
      if (!this.props.isInitiallyFinished) {
        this.props.onFetchNotifications(MINIMUM_RESULTS_TO_FETCH)
      }
    }
  }

  function mapStateToProps(state) {
    const currentOrganizationId = selectCurrentOrganizationId(state)
    return {
      notificationIds: NotificationsModelSelectors.selectNotificationIds(state, { notificationCenterType: NotificationCenterType.ALL }),
      hasMoreToLoad: selectHasMoreToLoad(state, { objectId: currentOrganizationId, requestType: getUserNotifications }),
      isLoading: selectRequestIsLoading(state, { objectId: currentOrganizationId, requestType: getUserNotifications }),
      isInitiallyFinished: selectIsRequestFinished(state, { objectId: currentOrganizationId, requestType: getUserNotifications })
    }
  }

  function mapDispatchToProps(dispatch) {
    return {
      onFetchNotifications: (limit) => dispatch(NotificationsModelActions.onFetchNotifications(limit)),
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceNotificationsCenterScene)
}

export default Enhance
