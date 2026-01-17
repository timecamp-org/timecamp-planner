import { StyleSheet } from 'react-native'

import {
  wisteriaColor,
  whiteTwoColor,
  cloudyBlueColor,
} from 'common/commonStyles/colors'
import {
  largeBorderRadius,
  mediumFontSize,
  gridCellSize,
  largerFontSize,
} from 'styles/common'

const styles = StyleSheet.create({
  component: {
    width: '100%',
    height: '100%',
    backgroundColor: whiteTwoColor,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2 * gridCellSize,
    paddingRight: 2 * gridCellSize,
  },
  image: {
    //TODO: react-resize-layout (?) Math.min(wp, 200)
    width: 100,
    height: 150,
  },
  title: {
    fontSize: largerFontSize,
    color: cloudyBlueColor,
    textAlign: 'center',
    borderRadius: largeBorderRadius,
    marginTop: 2 * gridCellSize,
    marginBottom: 2 * gridCellSize,
  },
  message: {
    textAlign: 'center',
    fontSize: mediumFontSize,
    color: cloudyBlueColor,
  }
})

export default styles
