import { StyleSheet } from 'react-native'
import { whiteTwoColor, wisteriaColor, blackColor } from 'common/commonStyles/colors'

export const moreButtonWidth = 50
export const tabNavigationHeight = 50

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: tabNavigationHeight,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: whiteTwoColor,
    // ios shadow
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 5,
    shadowOpacity: 0.5,
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
  tabItemUnselected: {
    color: blackColor,
  },
})

export default styles
