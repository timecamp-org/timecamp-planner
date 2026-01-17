import { StyleSheet } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

import {
  whiteTwoColor,
  cloudyBlueColor,
  whiteColor,
  blueyGreyColor,
} from 'common/commonStyles/colors'
import {
  largeBorderRadius,
  gridCellSize,
} from 'styles/common'
import isIOS from '../../../utils/isIOS'
import { iphoneXBottomMargin, isIphoneX } from '../../../utils/iphoneX'

const styles = StyleSheet.create({
  component: {
    backgroundColor: whiteTwoColor,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    flex: 1,
  },
  loaderWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listWrapper: {
    maxHeight: '100%',
    paddingTop: (isIOS ? 0 : 2 * gridCellSize),
    paddingHorizontal: 2 * gridCellSize,
    paddingBottom: (isIphoneX() ? iphoneXBottomMargin : 6 * gridCellSize),
  },
  addList: {
    width: wp('100%') - (8 * gridCellSize),
    backgroundColor: whiteColor,
    margin: 2 * gridCellSize,
    padding: 2 * gridCellSize,
    borderRadius: largeBorderRadius,
    height: 8 * gridCellSize,
    alignItems: 'center',
    flexDirection: 'row',
  },
  addListText: {
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
})

export default styles
