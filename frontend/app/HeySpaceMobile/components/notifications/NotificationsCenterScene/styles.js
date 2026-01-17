import { StyleSheet } from 'react-native'
import { blueGreyColor, whiteTwoColor } from 'common/commonStyles/colors'
import { mediumFontSize, gridCellSize } from 'styles/common'
import { iphoneXBottomMargin, isIphoneX } from '../../../utils/iphoneX'

const styles = StyleSheet.create({
  loaderWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listWrapper: {
    position: 'relative',
    marginBottom: (isIphoneX() ? iphoneXBottomMargin : 0),
  },
  loadingMore: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingMoreText: {
    width: '100%',
    height: gridCellSize * 8,
    lineHeight: gridCellSize * 8,
    fontSize: mediumFontSize,
    backgroundColor: whiteTwoColor,
    color: blueGreyColor,
    textAlign: 'center',
  },
})

export default styles
