import { StyleSheet } from 'react-native'
import { headingFontSize, mediumFontSize, normalFontSize, gridCellSize } from 'styles/common'
import {
  blueGreyColor,
  darkGreyBlueColor,
  whiteColor,
  whiteTwoColor,
} from 'common/commonStyles/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    backgroundColor: whiteTwoColor,
  },
  title: {
    fontSize: mediumFontSize,
    color: blueGreyColor,
    paddingBottom: gridCellSize * 2,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: whiteColor,
  },
  buttonText: {
    fontSize: headingFontSize,
    color: darkGreyBlueColor,
  },
  workspaceTile: {
    marginVertical: gridCellSize,
  }
})

export default styles
