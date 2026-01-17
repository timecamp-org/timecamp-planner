import { StyleSheet } from 'react-native'
import { brightBlueColor, brightRedColor, cloudyBlueColor } from 'common/commonStyles/colors'
import { largeFontSize } from 'styles/common'


const styles = StyleSheet.create({
  container: {
    backgroundColor: cloudyBlueColor,
    position: 'relative',
  },
  option: {
    color: brightBlueColor,
    fontSize: largeFontSize,
  },
  optionDestructive: {
    color: brightRedColor,
  },
  imageOverlay: {
    position: 'absolute',
    backgroundColor: cloudyBlueColor,
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
})

export default styles
