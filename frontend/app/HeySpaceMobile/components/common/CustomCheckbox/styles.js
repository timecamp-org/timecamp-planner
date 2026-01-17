import { StyleSheet } from 'react-native'
import { defaultBorderRadius } from 'styles/common'

const styles = StyleSheet.create({
  container: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: defaultBorderRadius,
  },
  tickIcon: {
    width: 15,
    height: 15,
  },
})

export default styles
