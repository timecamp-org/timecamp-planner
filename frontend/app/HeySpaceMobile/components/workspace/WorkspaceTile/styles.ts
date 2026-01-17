import { StyleSheet } from 'react-native'
import { headingFontSize, largeBorderRadius, gridCellSize } from 'styles/common'
import {
  darkGreyBlueColor,
  cloudyBlueColor,
} from 'common/commonStyles/colors'

const styles = StyleSheet.create({
  workspaceButton: {
    height: 40,
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: headingFontSize,
    color: darkGreyBlueColor,
  },
  image: {
    width: 8 * gridCellSize,
    height: 8 * gridCellSize,
    borderRadius: largeBorderRadius,
    marginRight: gridCellSize * 2,
  },
  initials: {
    width: 8 * gridCellSize,
    height: 8 * gridCellSize,
    borderRadius: largeBorderRadius,
    backgroundColor: cloudyBlueColor,
    marginRight: gridCellSize * 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontWeight: '700'
  }
})

export default styles
