import { StyleSheet } from 'react-native'
import {
  whiteTwoColor,
  blueGreyColor,
  darkTwoColor,
  wisteriaColor,
  cloudyBlueColor,
} from 'styles/colors'
import {
  defaultBorderRadius,
  gridCellSize,
  fontFamilyFour,
  largerFontSize,
  mediumFontSize,
  largeBorderRadius,
  headingFontSize,
} from 'styles/common'

import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: whiteTwoColor,
    borderRadius: defaultBorderRadius,
    alignItems: 'center',
    paddingTop: gridCellSize * 3,
    paddingBottom: gridCellSize * 3,
  },
  header: {
    padding: gridCellSize * 2,
    fontSize: largerFontSize,
    color: blueGreyColor,
    textAlign: 'center',
    fontFamily: fontFamilyFour,
  },
  text: {
    padding: gridCellSize * 2,
    justifyContent: 'center',
    fontSize: mediumFontSize,
    color: blueGreyColor,
    textAlign: 'center',
    fontFamily: fontFamilyFour,
  },
  buttons: {
    flexDirection: 'column',
    width: '100%',
    marginTop: gridCellSize * 2,
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: largeBorderRadius,
    paddingHorizontal: gridCellSize * 2,
    paddingVertical: gridCellSize,
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: gridCellSize * 2,
  },
  mascot: {
    height: Math.min(wp('40%'), 50 * gridCellSize),
    width: Math.min(wp('40%'), 50 * gridCellSize),
  },
  primaryButtons: {
    height: gridCellSize * 10,
    flexDirection: 'row',
    width: '100%',
  },
  tellUsButton: {
    backgroundColor: wisteriaColor,
  },
  buttonText: {
    color: whiteTwoColor,
    fontFamily: fontFamilyFour,
    fontSize: headingFontSize,
  },
  buttonIcon: {
    height: gridCellSize * 6,
    width: gridCellSize * 6,
  },
  rateUsButton: {
    backgroundColor: darkTwoColor,
  },
  remindLateButton: {
    marginTop: gridCellSize * 3,
    height: gridCellSize * 6,
    width: gridCellSize * 30,
    borderColor: cloudyBlueColor,
    borderWidth: 1,
    borderRadius: largeBorderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: gridCellSize * 2,
    paddingVertical: gridCellSize,
  },
  remindLateButtonText: {
    textAlign: 'center',
    color: cloudyBlueColor,
    fontSize: mediumFontSize,
  },
})

export default styles
