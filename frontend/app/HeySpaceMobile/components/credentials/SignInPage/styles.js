import { StyleSheet } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

import { whiteTwoColor, coralPinkTwoColor } from 'styles/colors'
import { gridCellSize, smallFontSize } from 'styles/common'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: whiteTwoColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  top: {
    marginBottom: 4 * gridCellSize,
  },
  scroll: {
    minHeight: '80%',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: Math.min(wp('100%'), gridCellSize * 83),
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4 * gridCellSize,
  },
  fetchErrorMessage: {
    marginTop: 2 * gridCellSize,
    fontSize: smallFontSize,
    color: coralPinkTwoColor,
  },
})

export default styles
