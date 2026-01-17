import { StyleSheet } from 'react-native'

import { gridCellSize } from '../../../styles/common'
import { whiteTwoColor, blueGreyColor } from 'common/commonStyles/colors'

const styles = StyleSheet.create({
  component: {
    width: '100%',
    justifyContent: 'flex-end',
    paddingHorizontal: gridCellSize * 2,
    flexDirection: 'row',
    marginLeft: 'auto',
    right: 0,
  },
  icon: {
    width: gridCellSize * 4,
    height: gridCellSize * 4,
    marginHorizontal: 1,
  },
  countWrapper: {
    width: gridCellSize * 4,
    height: gridCellSize * 4,
    borderRadius: gridCellSize * 4,
    backgroundColor: blueGreyColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    color: whiteTwoColor,
    fontSize: gridCellSize * 2,
  },
})

export default styles
