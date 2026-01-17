import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { Animated, Text, TouchableOpacity, View } from 'react-native'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { wisteriaColor } from 'common/commonStyles/colors'
import { List } from 'immutable'
import { doNothing } from 'common/utils'

TabNavigation.propTypes = {
  selectedTab: PropTypes.string.isRequired,
  tabItems: ImmutablePropTypes.list,
  isPopoverVisible: PropTypes.bool,
  tabWidth: PropTypes.number,
  left: PropTypes.object,
  activeColor: PropTypes.string,

  onChangeTab: PropTypes.func.isRequired,
  moreButtonRenderer: PropTypes.func,
}

TabNavigation.defaultProps = {
  tabItems: new List(),

  onChangeTab: doNothing,
  moreButtonRenderer: doNothing,
}

function TabNavigation(props) {
  return (
    <View style={styles.container}>
      {props.tabItems.map(tabRenderer(props))}
      {props.moreButtonRenderer ? props.moreButtonRenderer() : null}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          height: 2,
          backgroundColor: props.activeColor || wisteriaColor,
          transform: ([{ translateX: props.left }]),
          width: props.tabWidth,
        }}
      />
    </View>
  )
}

const tabRenderer = (props) => (tab) => {
  const key = tab.get('key')
  const text = tab.get('text')

  return (
    <TouchableOpacity
      style={styles.tabItem}
      key={key}
      onPress={() => props.onChangeTab(key)}
    >
      <Text style={props.selectedTab === key ? { ...styles.tabItemSelected, color: props.activeColor || wisteriaColor } : styles.tabItemUnselected}>{text}</Text>
    </TouchableOpacity>
  )
}


export default TabNavigation
