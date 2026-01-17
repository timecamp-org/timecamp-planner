import React from 'react'
import { List } from 'immutable'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import styles from './styles'
import { doNothing } from 'common/utils'

import { View, Text, VirtualizedList } from 'react-native'
import NotificationListItem from '../../notifications/NotificationListItem'
import Loader from '../../common/Loader'

NotificationsCenterScene.propTypes = {
  className: PropTypes.string,
  notificationIds: ImmutablePropTypes.list,
  isLoading: PropTypes.bool.isRequired,
  notificationsListHeight: PropTypes.number.isRequired,

  onEndReached: PropTypes.func.isRequired,
}

NotificationsCenterScene.defaultProps = {
  notificationIds: new List(),
  notificationsListHeight: 0,
  isLoading: false,

  onEndReached: doNothing,
}

function NotificationsCenterScene(props) {
  if (props.isLoading && !props.isNextPageLoading) {
    return (
      <Loader
        containerStyles={styles.loaderWrapper}
      />
    )
  } else {
    return (
      <View style={styles.listWrapper}>
        <VirtualizedList
          data={props.notificationIds}
          renderItem={notificationItemRenderer}
          getItem={(data, index) => data.get(index)}
          getItemCount={data => data.size}
          keyExtractor={notificationId => notificationId}
          onEndReached={props.onEndReached}
          onEndReachedThreshold={0.1}
          ListFooterComponent={listFooterRenderer(props.isNextPageLoading)}
        />
      </View>
    )
  }
}

function listFooterRenderer(shouldRenderFooter) {
  return shouldRenderFooter
    ? <Text style={styles.loadingMoreText}>{'Loading more notifications...'}</Text>
    : null
}

function notificationItemRenderer({ item: notificationId }) {
  return <NotificationListItem notificationId={notificationId} />
}
export default NotificationsCenterScene
