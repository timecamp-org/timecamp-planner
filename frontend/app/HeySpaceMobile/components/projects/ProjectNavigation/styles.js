import { StyleSheet } from 'react-native'
import { cloudyBlueColor, whiteTwoColor, wisteriaColor } from 'common/commonStyles/colors'
import isIOS from '../../../utils/isIOS'


export const moreButtonWidth = 50

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 50,
    width: '100%',
    flexDirection: isIOS ? 'column' : 'row',
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
  threeDotDropdown: {
    width: 30,
  },
  moreButton: {
    height: '100%',
    width: moreButtonWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreVerticalIcon: {
    height: 20,
    width: 15,
  },
  tabItemSelected: {
    color: wisteriaColor,
  },
  menuItem: {
    flexDirection: 'row',
    height: 30,
    alignItems: 'center',
  },
  popoverMenuItemText: {
    marginLeft: 5,
    color: cloudyBlueColor,
  },
  icon: {
    width: 25,
    height: 25,
  },
})

export default styles
