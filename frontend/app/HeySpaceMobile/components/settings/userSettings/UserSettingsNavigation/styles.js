import { StyleSheet } from 'react-native'
import {
  darkGreyBlueColor,
  whiteTwoColor,
} from 'common/commonStyles/colors'
import { headingFontSize } from 'styles/common'

const styles = StyleSheet.create({
  container: {
    backgroundColor: whiteTwoColor,
    height: '100%',
  },
  button: {
    height: 40,
    alignItems: 'center',
    flexDirection: 'row',
    margin: 10,
  },
  buttonText: {
    fontSize: headingFontSize,
    color: darkGreyBlueColor,
  },
})

export default styles
