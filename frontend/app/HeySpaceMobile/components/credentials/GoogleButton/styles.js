import { StyleSheet } from 'react-native'

import {
  blueGreyColor,
  warmGrey5Color,
  whiteTwoColor,
  whiteColor,
  darkGreyBlueColor,
} from 'styles/colors'
import {
  largeBorderRadius,
  mediumFontSize,
  gridCellSize,
} from 'styles/common'

import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: largeBorderRadius,
    flexDirection: 'row',
    width: Math.min(wp('100%'), gridCellSize * 50),
    height: gridCellSize * 12,
    position: 'relative',
  },
  icon: {
    width: 4 * gridCellSize,
    height: 4 * gridCellSize,
  },
  title: {
    color: blueGreyColor,
    fontSize: mediumFontSize,
    fontWeight: 'bold',
    marginLeft: 2 * gridCellSize,
  },
  googleButtonWrapper: {
    flex: 1,
    height: '100%',
    backgroundColor: whiteTwoColor,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    borderRadius: largeBorderRadius,
  },
  googleButtonDisabledWrapper: {
    flex: 1,
    height: '100%',
    backgroundColor: whiteColor,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    borderRadius: largeBorderRadius,
  },
  googleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButtonIcon: {
    width: gridCellSize * 5,
    height: gridCellSize * 5,
    marginRight: gridCellSize * 2,
  },
  googleButtonText: {
    fontSize: mediumFontSize,
    color: darkGreyBlueColor,
  },
  googleButtonDisabledText: {
    fontSize: mediumFontSize,
    color: warmGrey5Color,
  }
})

export default styles
