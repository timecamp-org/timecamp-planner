import { StyleSheet } from 'react-native'

import { boldFontWeight, mediumFontSize, gridCellSize } from '../../../styles/common'
import { blueGreyColor } from 'common/commonStyles/colors'

const styles = StyleSheet.create({
  buttonContent: {
    marginLeft: gridCellSize * 6,
    paddingLeft: gridCellSize * 3,
    flexDirection: 'row',
    alignItems: 'center',
    height: gridCellSize * 8,
  },
  buttonText: {
    marginLeft: gridCellSize * 2,
    marginRight: gridCellSize * 4,
    fontSize: mediumFontSize,
    fontWeight: boldFontWeight,
    color: blueGreyColor,
  },
})

export default styles
