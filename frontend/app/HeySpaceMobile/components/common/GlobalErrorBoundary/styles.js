import { StyleSheet } from 'react-native'
import {
  whiteTwoColor, black60Color, lightGreyColor, 
} from 'common/commonStyles/colors'
import { largerFontSize, boldFontWeight, gridCellSize, fontFamilyTwo, normalFontSize, blackFontWeight } from 'styles/common'

const styles = StyleSheet.create({
  component: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    padding: 4 * gridCellSize,
    color: black60Color,
    backgroundColor: whiteTwoColor,
  },
  mascot: {
    width: '100%',
    height: '100%',
    zIndex: 1000,
  },
  title: {
    padding: 3 * gridCellSize,
    fontFamily: fontFamilyTwo,
    fontSize: largerFontSize,
    fontWeight: boldFontWeight,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    padding: 3 * gridCellSize,
    fontSize: normalFontSize,
    width: 71 * gridCellSize,
  },
  top: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    height: 36 * gridCellSize,
    justifyContent: 'center',
  },
  background: {
    fontSize: 160,
    fontFamily: fontFamilyTwo,
    fontWeight: blackFontWeight,
    color: lightGreyColor,
    zIndex: 0,
    position: 'absolute',
    top: -15 * gridCellSize,
    left: 0,
    right: 0,
    textAlign: 'center',
  }
})

export default styles
