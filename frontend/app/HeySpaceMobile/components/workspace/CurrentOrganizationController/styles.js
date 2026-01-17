import { StyleSheet } from 'react-native'
import { blueGreyColor, whiteTwoColor } from 'common/commonStyles/colors'
import { boldFontWeight, gridCellSize, mediumFontSize, normalFontSize, defaultBorderRadius } from 'styles/common'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

const styles = StyleSheet.create({
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: whiteTwoColor,
    borderRadius: defaultBorderRadius,
    padding: gridCellSize * 4,
    width: '100%',
  },

  header: {
    fontSize: mediumFontSize,
    color: blueGreyColor,
    fontWeight: boldFontWeight,
    marginTop: gridCellSize * 2,
    marginBottom: gridCellSize,
  },

  text: {
    fontSize: normalFontSize,
    color: blueGreyColor,
    width: '100%',
    textAlign: 'center',
  },

  mascot: {
    height: Math.min(wp('40%'), 50 * gridCellSize),
    width: Math.min(wp('40%'), 50 * gridCellSize),
  },

  buttonWrapper: {
    width: '100%',
  },

  button: {
    width: gridCellSize * 20,
    marginLeft: 'auto',
  }
})

export default styles
