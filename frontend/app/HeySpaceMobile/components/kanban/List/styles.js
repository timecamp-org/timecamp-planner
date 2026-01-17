import { StyleSheet } from 'react-native'

import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

import {
  cloudyBlueColor,
  whiteColor,
  blueGreyColor,
  blueyGreyColor,
} from 'common/commonStyles/colors'
import {
  largeBorderRadius,
  mediumFontSize,
  gridCellSize,
  boldFontWeight,
} from 'styles/common'
import { isIphoneX } from '../../../utils/iphoneX'

const styles = StyleSheet.create({
  component: {
    width: wp('100%') - (8 * gridCellSize),
    maxHeight: '100%',
    backgroundColor: whiteColor,
    marginTop: (isIphoneX() ? 0 : 2 * gridCellSize),
    marginHorizontal: 2 * gridCellSize,
    marginBottom: (isIphoneX() ? 0 : 2 * gridCellSize),
    padding: 2 * gridCellSize,
    borderRadius: largeBorderRadius,
  },
  header: {
    flexDirection: 'row',
    height: 8 * gridCellSize,
    alignItems: 'center',
  },
  listName: {
    color: blueGreyColor,
    fontSize: mediumFontSize,
    fontWeight: boldFontWeight,
  },
  eyeIcon: {
    height: 4 * gridCellSize,
    width: 4 * gridCellSize,
  },
  footerText: {
    marginLeft: 2 * gridCellSize,
    color: blueyGreyColor,
  },
  addIconWrapper: {
    height: 4 * gridCellSize,
    width: 4 * gridCellSize,
    backgroundColor: cloudyBlueColor,
    borderRadius: 2 * gridCellSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    height: 2 * gridCellSize,
    width: 2 * gridCellSize,
  },
  estimateEffort: {
    flexDirection: 'row',
    color: blueGreyColor,
    marginLeft: 2 * gridCellSize,
    fontSize: mediumFontSize,
    fontWeight: boldFontWeight,
  },
  footer: {
    width: '100%',
    height: 8 * gridCellSize,
    alignItems: 'center',
    flexDirection: 'row',
  },
  listNameWrapper: {
    flex: 1,
    height: 8 * gridCellSize,
    justifyContent: 'center',
  }
})

export default styles
