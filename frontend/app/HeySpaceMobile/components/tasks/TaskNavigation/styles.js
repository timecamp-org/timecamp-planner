import { StyleSheet } from 'react-native'
import { cloudyBlueColor, whiteTwoColor, wisteriaColor } from 'common/commonStyles/colors'

export const moreButtonWidth = 50

const styles = StyleSheet.create({
  tabNavigationIOS: {
    height: 50,
  },
  tabNavigationAndroid: {
    position: 'relative',
    height: 50,
    flexDirection: 'row',
    backgroundColor: whiteTwoColor,
    // android shadow
    elevation: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemSelected: {
    color: wisteriaColor,
  },
})

export default styles
