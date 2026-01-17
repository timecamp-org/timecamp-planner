import { StyleSheet } from 'react-native'
import { iOSSettingsDividerColor, whiteTwoColor } from "common/commonStyles/colors"


const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 1,
    backgroundColor: whiteTwoColor,
  },
  divider: {
    width: '100%',
    height: '100%',
    backgroundColor: iOSSettingsDividerColor,
  },
})

export default styles
