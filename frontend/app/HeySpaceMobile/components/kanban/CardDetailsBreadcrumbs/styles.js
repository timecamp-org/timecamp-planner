import { StyleSheet } from 'react-native'

import {
  cloudyBlueColor,
} from 'common/commonStyles/colors'
import {
  fontFamilyTwo,
  smallFontSize,
  normalFontSize,
  gridCellSize,
  largeBorderRadius,
  boldFontWeight,
} from 'styles/common'

const name = {
  marginLeft: gridCellSize,
  marginRight: gridCellSize,
  overflow: 'hidden',
  borderWidth: 0,
  borderRadius: largeBorderRadius,
  padding: gridCellSize,
  fontSize: normalFontSize,
  color: cloudyBlueColor,
  fontWeight: boldFontWeight,
}

const styles = StyleSheet.create({
  Component: {
    marginTop: 2 * gridCellSize,
    marginHorizontal: 2 * gridCellSize,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    color: cloudyBlueColor,
    fontFamily: fontFamilyTwo,
    fontSize: smallFontSize,
    width: '100%',
  },
  projectName: name,
  sectionName: name,
  listItemButton: name,
  separator: {
    height: 2 * gridCellSize,
    width: 2 * gridCellSize,
  },
  modal: {
    flex: 1,
  },
})

export default styles
