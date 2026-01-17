import { StyleSheet } from 'react-native'
import { mediumFontSize, regularFontWeight } from 'styles/common'

const styles = StyleSheet.create({
  navLink: {
    textDecorationLine: 'underline',
    fontSize: mediumFontSize,
  },
  textElement: {
    paddingLeft: 2,
    paddingRight: 2,
    fontWeight: regularFontWeight,
    fontSize: mediumFontSize,
  },
})

export default styles
