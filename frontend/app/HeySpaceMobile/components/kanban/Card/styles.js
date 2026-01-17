import { StyleSheet } from 'react-native'

import {
  wisteriaColor,
  whiteTwoColor,
  cloudyBlueColor,
  whiteThreeColor,
  blueGreyColor,
  darkGreyBlueColor,
  whiteColor,
} from 'common/commonStyles/colors'
import {
  largeBorderRadius,
  mediumFontSize,
  gridCellSize,
  largerFontSize,
  normalFontSize,
} from 'styles/common'

const styles = StyleSheet.create({
  component: {
    width: '100%',
    minHeight: 10 * gridCellSize,
    backgroundColor: whiteTwoColor,
    borderRadius: largeBorderRadius,
    position: 'relative',
    marginTop: gridCellSize,
    marginBottom: gridCellSize,
    overflow: 'hidden',
  },
  colorLine: {
    height: 3,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  content: {
    padding: 2 * gridCellSize,
    color: darkGreyBlueColor,
  },
  taskName: {
    fontSize: mediumFontSize,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 3 * gridCellSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  firstRowItem: {
    flex: 1,
  },
  middleRowItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lastRowItem: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rowItemText: {
    color: blueGreyColor,
    fontSize: normalFontSize,
  },
  taskProgressWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 36,
    width: 36,
    backgroundColor: whiteColor,
    borderRadius: 36,
  },
  taskProgress: {
    color: blueGreyColor,
    fontSize: normalFontSize,
  },
})

export default styles
