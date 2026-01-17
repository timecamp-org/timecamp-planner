import { StyleSheet } from 'react-native'
import { gridCellSize, largerFontSize, mediumFontSize } from 'styles/common'
import { blueGreyColor } from 'common/commonStyles/colors'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascot: {
    height: Math.min(wp('40%'), 50 * gridCellSize),
    width: Math.min(wp('40%'), 50 * gridCellSize),
  },
  textWrapper: {
    width: '75%',
  },
  title: {
    fontSize: largerFontSize,
    color: blueGreyColor,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: mediumFontSize,
    color: blueGreyColor,
    textAlign: 'center',
  },
})

export default styles
