import { StyleSheet } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

import { whiteTwoColor, blueGreyColor } from 'styles/colors'
import { gridCellSize, largerFontSize } from 'styles/common'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: whiteTwoColor,
  },
  header: {
    color: blueGreyColor,
    fontSize: largerFontSize,
    marginBottom: 2 * gridCellSize,
  },
  mascot: {
    height: Math.min(wp('40%'), 50 * gridCellSize),
    width: Math.min(wp('40%'), 50 * gridCellSize),
  },
  content: {
    flex: 1,
    width: Math.min(wp('100%'), gridCellSize * 83),
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2 * gridCellSize,
  },
  description: {
    color: blueGreyColor,
    marginBottom: 4 * gridCellSize,
  },
})

export default styles
