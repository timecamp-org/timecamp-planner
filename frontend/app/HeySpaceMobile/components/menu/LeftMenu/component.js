import React, { useRef, useCallback, memo } from 'react'
import PropTypes from 'prop-types'
import { ScrollView, View } from 'react-native'
import styles from './styles'

import CurrentUserNavInfo from '../CurrentUserNavInfo'
import SettingsMenu from '../../settings/SettingsMenu'
import NavMenu from '../NavMenu'

import { leftMenuTabTypes, leftMenuTabTypesValues } from './leftMenuTabTypes'

LeftMenu.propTypes = {
  selectedTab: PropTypes.oneOf(leftMenuTabTypesValues),
  onChangeSelectedTab: PropTypes.func.isRequired,
}

LeftMenu.defaultProps = {
  selectedTab: leftMenuTabTypes.NAV,
}

function LeftMenu(props) {
  const scrollRef = useRef(null)
  const onChangeSelectedTab = useCallback((tabType) => {
    scrollRef.current.scrollTo({ x: 0, y: 0, animated: false})
    props.onChangeSelectedTab(tabType)
  }, [scrollRef, props.onChangeSelectedTab])
  const isSettingsMenuOpened = props.selectedTab === leftMenuTabTypes.SETTINGS

  return (
    <View style={styles.container}>
      <CurrentUserNavInfo
        selectedTab={props.selectedTab}
        onChangeSelectedTab={onChangeSelectedTab}
      />
      <ScrollView ref={scrollRef} style={styles.scrollView} scrollEnabled={!isSettingsMenuOpened}>
        <NavMenu />
        {isSettingsMenuOpened && <SettingsMenu />}
      </ScrollView>
    </View>
  )
}

export default memo(LeftMenu)
