import { StyleSheet } from 'react-native'

import { whiteColor, blackColor } from 'common/commonStyles/colors'
import { gridCellSize, boldFontWeight } from '../../../styles/common'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    minHeight: gridCellSize * 10,
    maxHeight: gridCellSize * 40,
    borderWidth: 3,
    borderRadius: (gridCellSize * 8) / 2,
    borderColor: whiteColor,
  },
  input: {
    color: blackColor,
    flex: 1,
    marginLeft: gridCellSize,
    paddingLeft: gridCellSize * 4,
    paddingRight: gridCellSize * 10,
  },
  sendButton: {
    paddingRight: 2 * gridCellSize,
    paddingBottom: 2 * gridCellSize,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  textElement: {
    color: blackColor,
  },
  mention: {
    fontWeight: boldFontWeight,
  },
})

export default styles
