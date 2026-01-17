import { StyleSheet } from 'react-native'

import { whiteTwoColor, blueGreyColor } from 'common/commonStyles/colors'
import { largerFontSize, gridCellSize } from 'styles/common'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: whiteTwoColor,
    alignItems: 'center',
    marginBottom: 10 * gridCellSize,
  },
  header: {
    color: blueGreyColor,
    fontSize: largerFontSize,
  },
})

export default styles
