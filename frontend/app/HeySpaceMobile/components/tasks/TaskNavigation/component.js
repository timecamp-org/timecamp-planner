import React from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import { doNothing } from 'common/utils'
import tabTypes from 'components/tasks/TaskNavigation/tabTypes'

import styles from './styles'
import TabNavigation from 'commonComponents/TabNavigation'
import { fromJS } from 'immutable'
import isIOS from 'utils/isIOS'
import CardOptionsPopover from '../../kanban/CardOptionsPopover'

TaskNavigation.propTypes = {
  taskId: PropTypes.string.isRequired,
  selectedTab: PropTypes.string.isRequired,
  onChangeTab: PropTypes.func.isRequired,
  taskColor: PropTypes.string,
}

TaskNavigation.defaultProps = {
  selectedTab: tabTypes.DETAILS,
  onChangeTab: doNothing,
}

const tabItems = fromJS([
  {
    key: tabTypes.DETAILS,
    text: 'Details',
  },
  {
    key: tabTypes.COMMENTS,
    text: 'Comments',
  },
])

export default function TaskNavigation(props) {
  return (
    <View style={isIOS ? styles.tabNavigationIOS : styles.tabNavigationAndroid}>
      <TabNavigation
        tabItems={tabItems}
        activeColor={props.taskColor}
        selectedTab={props.selectedTab}
        onChangeTab={props.onChangeTab}
        moreButtonRenderer={() => <CardOptionsPopover taskId={props.taskId} />}
        additionalOffset={20}
      />
    </View>
  )
}
