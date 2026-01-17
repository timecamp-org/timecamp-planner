import { StyleSheet } from 'react-native'

import { blueGreyColor, whiteTwoColor, darkBlueGreyColor, duskColor } from 'common/commonStyles/colors'
import { gridCellSize, boldFontWeight, mediumFontSize, largeBorderRadius } from 'styles/common'

const planetIcon = {
  marginLeft: gridCellSize,
  height: gridCellSize * 4,
  width: gridCellSize * 4,
  marginRight: gridCellSize * 4,
}

const styles = StyleSheet.create({
  button: {
    padding: gridCellSize,
  },
  selectedButton: {
    padding: gridCellSize,
    backgroundColor: darkBlueGreyColor,
    borderRadius: largeBorderRadius,
  },
  buttonContent: {
    flex: 1,
    height: gridCellSize * 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  planetIcon,
  badge: {
    width: gridCellSize * 5,
    height: gridCellSize * 5,
    borderRadius: gridCellSize * 3,
    marginLeft: 'auto',
  },
  buttonText: {
    color: blueGreyColor,
    fontSize: mediumFontSize,
    fontWeight: boldFontWeight,
  },
  buttonTextUnread: {
    color: whiteTwoColor,
    fontSize: mediumFontSize,
    fontWeight: boldFontWeight,
  },
  mutedProjectName: {
    color: duskColor,
    fontSize: mediumFontSize,
    fontWeight: boldFontWeight,
  },
  mutedProjectIcon: {
    ...planetIcon,
    opacity: 0.5,
  },
})

export default styles
