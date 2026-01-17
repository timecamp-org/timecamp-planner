import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { View, StyleSheet } from 'react-native'
import SegmentedControl from '@react-native-community/segmented-control'
import { doNothing } from 'common/utils'
import { blackColor, dodgerBlueColor, whiteColor, whiteTwoColor } from 'common/commonStyles/colors'
import { isIOS13 } from '../../../utils/isIOS'

TabNavigation.propTypes = {
  selectedTabIndex: PropTypes.number,
  tabItems: PropTypes.array,
  wrapperBackgroundColorIOS: PropTypes.string,
  onChangeTab: PropTypes.func,
}

TabNavigation.defaultProps = {
  selectedTabIndex: 0,
  wrapperBackgroundColorIOS: whiteTwoColor,
  onChangeTab: doNothing,
}

function TabNavigation(props) {
  return (
    <View style={StyleSheet.flatten([styles.container, { backgroundColor: props.wrapperBackgroundColorIOS }])}>
      <SegmentedControl
        values={props.tabItems}
        selectedIndex={props.selectedTabIndex}
        onChange={props.onChangeTab}
        tintColor={isIOS13 ? whiteTwoColor : dodgerBlueColor}
        backgroundColor={whiteColor}
        textColor={blackColor}
      />
    </View>
  )
}

export default TabNavigation
