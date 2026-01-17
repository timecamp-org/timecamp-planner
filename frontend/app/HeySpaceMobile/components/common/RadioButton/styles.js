import { StyleSheet } from 'react-native'
import { wisteriaColor, wisteria50Color, cloudyBlueColor } from 'common/commonStyles/colors'

const outerCircleSize = 25
const innerCircleSize = 15

const styles = StyleSheet.create({
  outerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: outerCircleSize,
    width: outerCircleSize,
    borderRadius: outerCircleSize / 2,
    borderWidth: 2,
    borderColor: wisteriaColor,
  },
  innerCircle: {
    width: innerCircleSize,
    height: innerCircleSize,
    borderRadius: innerCircleSize / 2,
    backgroundColor: wisteria50Color,
  },
  disabled: {
    borderColor: cloudyBlueColor,
  },
  disabledInner: {
    backgroundColor: cloudyBlueColor,
  },
})

export default styles
