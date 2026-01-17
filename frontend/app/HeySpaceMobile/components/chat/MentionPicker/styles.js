import { StyleSheet } from 'react-native'

import { whiteColor, whiteTwoColor } from 'common/commonStyles/colors'
import { gridCellSize, largeBorderRadius } from '../../../styles/common'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    maxHeight: gridCellSize * 28,
    backgroundColor: whiteTwoColor,
    borderRadius: largeBorderRadius,
    bottom: gridCellSize * 12,
    elevation: 5,
  },
  userRow: {
    flexDirection: 'row',
    height: gridCellSize * 7,
    alignItems: 'center',
    marginHorizontal: gridCellSize,
    paddingHorizontal: gridCellSize,
    borderTopWidth: 1,
    borderTopColor: whiteColor,
  },
  userIcon: {
    marginRight: gridCellSize,
  },
})

export default styles
