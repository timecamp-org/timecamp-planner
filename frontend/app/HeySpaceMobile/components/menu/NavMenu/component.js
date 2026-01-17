import React from 'react'
import { View } from 'react-native'

import SpacesNavHeader from '../SpacesNavHeader'
import SpaceNavButtonList from '../../projects/SpaceNavButtonList'
import TeamNavHeader from '../TeamNavHeader'
import TeamNavButtonList from '../TeamNavButtonList'

function NavMenu() {
  return (
    <View>
      <SpacesNavHeader />
      <SpaceNavButtonList />
      <TeamNavHeader />
      <TeamNavButtonList />
    </View>
  )
}

export default NavMenu
