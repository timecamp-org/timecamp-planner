import { StyleSheet } from 'react-native'

import { blackColor, whiteTwoColor } from "common/commonStyles/colors"
import { defaultFontFamily, navTitleFontSize, gridCellSize } from 'styles/common'

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 2 * gridCellSize,
    paddingHorizontal: 3 * gridCellSize,
    backgroundColor: whiteTwoColor,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: defaultFontFamily,
    fontSize: navTitleFontSize,
    color: blackColor,
    marginRight: 'auto',
  },
})

export default styles
