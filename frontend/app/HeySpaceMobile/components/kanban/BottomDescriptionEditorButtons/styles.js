import { StyleSheet } from 'react-native'
import { cloudyBlueColor } from 'common/commonStyles/colors'
import { boldFontWeight, mediumFontSize } from 'styles/common'
import { iphoneXBottomMargin, isIphoneX } from '../../../utils/iphoneX'
import { gridCellSize } from '../../../styles/common'

const styles = StyleSheet.create({
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 3 * gridCellSize,
    paddingHorizontal: 4 * gridCellSize,
    paddingBottom: (isIphoneX() ? iphoneXBottomMargin : 3 * gridCellSize)
  },
  cancelButton: {
    height: 8 * gridCellSize,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2 * gridCellSize,
  },
  cancelButtonText: {
    color: cloudyBlueColor,
    fontSize: mediumFontSize,
    fontWeight: boldFontWeight,
  },
  saveButton: {
    width: 'auto',
    marginTop: 0,
    paddingHorizontal: 2 * gridCellSize,
  },
})

export default styles
