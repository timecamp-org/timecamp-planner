import { StyleSheet } from 'react-native'
import { whiteTwoColor } from 'common/commonStyles/colors'
import { gridCellSize } from '../../../styles/common'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { isIphoneX, iphoneXBottomMargin } from '../../../utils/iphoneX'

const isIphoneWithNotch = isIphoneX()

const styles = StyleSheet.create({
  Component: {
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
  messageBoardWrapper: {
    flex: 1,
  },
  messageBoardWithTabNavigation: {
    height: hp('100%') - (gridCellSize * (isIphoneWithNotch ? 28 : 24)) - (isIphoneWithNotch ? iphoneXBottomMargin : 0),
  },
  messageBoard: {
    height: hp('100%') - (gridCellSize * (isIphoneWithNotch ? 17 : 14)) - (isIphoneWithNotch ? iphoneXBottomMargin : 0),
  },
  messageList: {
    flex: 1,
  },
  inputWithIcons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 2 * gridCellSize,
    minHeight: gridCellSize * 10,
    position: 'relative',
  },
})

export default styles
