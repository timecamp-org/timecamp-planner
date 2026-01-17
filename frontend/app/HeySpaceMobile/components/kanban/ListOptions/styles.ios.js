import { StyleSheet } from 'react-native'

import { blueGreyColor, brightBlueColor } from 'common/commonStyles/colors'
import { gridCellSize } from 'styles/common'

const styles = StyleSheet.create({
  moreVerticalIcon: {
    height: 3 * gridCellSize,
    width: 2 * gridCellSize,
  },
  popoverIcon: {
    height: 3 * gridCellSize,
    width: 3 * gridCellSize,
  },
  moreButton: {
    width: 8 * gridCellSize,
    height: 8 * gridCellSize,
    justifyContent: 'center',
    alignItems: 'center',
    color: blueGreyColor,
  },
  popoverMenuItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  popoverMenuItemLabel: {
    color: brightBlueColor,
    fontSize: 20,
    marginLeft: 10,
  },
  popoverHeader: {
    textAlign: 'center',
    paddingTop: 2 * gridCellSize,
    paddingBottom: 2 * gridCellSize,
    marginLeft: 2 * gridCellSize,
    marginRight: 2 * gridCellSize,
    color: blueGreyColor,
    borderBottomWidth: 0.5,
    borderBottomColor: blueGreyColor,
  },
  disabled: {
    color: blueGreyColor,
  },
})

export default styles
