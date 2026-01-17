
import { StyleSheet } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import {
  gridCellSize,
  fontFamilyTwo,
  largeFontSize,
} from 'styles/common'

const styles = StyleSheet.create({
  Component: {
    padding: gridCellSize * 5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mascot: {
    height: Math.min(wp('40%'), 50 * gridCellSize),
    width: Math.min(wp('40%'), 50 * gridCellSize),
    marginVertical: gridCellSize * 2,
  },
  header: {
    fontFamily: fontFamilyTwo,
    fontSize: largeFontSize,
  },
  text: {
    textAlign: 'center',
  },
  hint: {
    marginTop: gridCellSize * 6,
  },
})

export default styles
