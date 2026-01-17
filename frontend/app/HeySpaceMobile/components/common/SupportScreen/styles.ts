
import { StyleSheet } from 'react-native'
import {
  gridCellSize,
  fontFamilyTwo,
  largeFontSize,
  headingFontSize,
} from 'styles/common'

import {
  whiteTwoColor,
} from 'common/commonStyles/colors'

const styles = StyleSheet.create({
  Component: {
    padding: gridCellSize * 5,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: whiteTwoColor,
    height: '100%',
  },
  header: {
    fontFamily: fontFamilyTwo,
    fontSize: largeFontSize,
  },
  text: {
    fontSize: headingFontSize,
    color: whiteTwoColor,
  },
  option: {
    marginTop: gridCellSize * 6,
    alignItems: 'center',
    flexDirection: 'row',
  },
})

export default styles
