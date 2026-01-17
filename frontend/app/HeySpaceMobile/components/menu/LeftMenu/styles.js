import { StyleSheet } from 'react-native'
import { darkTwoColor } from 'common/commonStyles/colors'
import { iphoneXBottomMargin, iphoneXTopMargin, isIphoneX } from '../../../utils/iphoneX'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTwoColor,
    paddingTop: (isIphoneX() ? iphoneXTopMargin : 0),
    paddingBottom: (isIphoneX() ? iphoneXBottomMargin : 0),
  },
  scrollView: {
    position: 'relative',
  },
  sectionName: {
    fontSize: 20,
  },
  projectName: {
    fontSize: 16,
    overlayColor: 'tomato',
  },
})

export default styles
