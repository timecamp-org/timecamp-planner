import { StyleSheet } from 'react-native'

import {
  blueGreyColor,
  whiteTwoColor,
  blackColor
} from 'styles/colors'
import {
  largeBorderRadius,
  mediumFontSize,
  gridCellSize,
  boldFontWeight,
} from 'styles/common'

import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: largeBorderRadius,
    flexDirection: 'row',
    width: Math.min(wp('100%'), gridCellSize * 50),
    height: gridCellSize * 8,
    position: 'relative',
  },
  title: {
    color: blueGreyColor,
    fontSize: mediumFontSize,
    fontWeight: 'bold',
    marginLeft: 2 * gridCellSize,
  },
  appleButtonWrapper: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    borderRadius: largeBorderRadius,
    backgroundColor: blackColor
  },
  appleButtonDisabledWrapper: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    borderRadius: largeBorderRadius,
    backgroundColor: blackColor
  },
  appleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appleButtonIcon: {
    width: gridCellSize * 3,
    height: gridCellSize * 3,
    marginRight: gridCellSize * 2,
  },
  appleButtonText: {
    fontSize: mediumFontSize,
    color: whiteTwoColor,
    fontWeight: boldFontWeight,
  },
  appleButtonDisabledText: {
    fontSize: mediumFontSize,
    color: whiteTwoColor,
    fontWeight: boldFontWeight,
  }
})

export default styles