import { StyleSheet } from 'react-native'

import { blueGreyColor } from 'common/commonStyles/colors'
import { gridCellSize } from 'styles/common'

const styles = StyleSheet.create({
  popoverIcon: {
    height: 3 * gridCellSize,
    width: 3 * gridCellSize,
  },
  moreButton: {
    height: '100%',
    width: 10 * gridCellSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreVerticalIcon: {
    height: 4 * gridCellSize,
    width: 3 * gridCellSize,
  },
  popoverMenuItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  popoverMenuItemLabel: {
    color: blueGreyColor,
    marginLeft: gridCellSize,
    width: 25 * gridCellSize,
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
})

export default styles
