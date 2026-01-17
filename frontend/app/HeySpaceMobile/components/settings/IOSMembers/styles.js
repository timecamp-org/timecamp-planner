import { StyleSheet } from 'react-native'

import { blackColor, brightBlueColor, brightRedColor, iOSSettingsBackground } from 'common/commonStyles/colors'
import { defaultFontFamily, navTitleFontSize, gridCellSize, headingFontSize } from 'styles/common'
import { iphoneXBottomMargin, isIphoneX } from '../../../utils/iphoneX'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: iOSSettingsBackground,
    marginBottom: (isIphoneX() ? iphoneXBottomMargin : 0),
  },
  option: {
    color: brightBlueColor,
    fontSize: 20,
  },
  optionDestructive: {
    color: brightRedColor,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 'auto',
  },
  personIcon: {
    marginRight: 2 * gridCellSize,
  },
  personFullName: {
    fontFamily: defaultFontFamily,
    fontSize: navTitleFontSize,
    color: blackColor,
  },
  emptyUserListMessage: {
    fontSize: headingFontSize,
    textAlign: 'center',
  },
})

export default styles
