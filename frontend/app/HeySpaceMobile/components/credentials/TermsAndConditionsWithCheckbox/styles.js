import { StyleSheet } from 'react-native'

import {
  wisteriaColor,
  coralPinkTwoColor,
} from 'common/commonStyles/colors'
import {
  boldFontWeight,
  gridCellSize,
} from 'styles/common'

const styles = StyleSheet.create({
  termsAndConditions: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4 * gridCellSize,
    paddingBottom: 2 * gridCellSize,
  },
  checkbox: {
    marginRight: 2 * gridCellSize,
  },
  message: {
    color: coralPinkTwoColor,
  },
  link: {
    color: wisteriaColor,
    fontWeight: boldFontWeight,
  },
  text: {
    marginRight: 6 * gridCellSize,
  },
})

export default styles
