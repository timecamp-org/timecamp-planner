import { StyleSheet } from 'react-native'
import { blueGreyColor } from 'common/commonStyles/colors'
import { boldFontWeight, largerFontSize, mediumFontSize } from 'styles/common'

const styles = StyleSheet.create({
  component: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: largerFontSize,
    fontWeight: boldFontWeight,
    color: blueGreyColor,
    textAlign: 'center',
    marginBottom: 60,
  },
  description: {
    fontSize: mediumFontSize,
    color: blueGreyColor,
    marginBottom: 25,
  },
  button: {
    marginTop: 30,
  },
})

export default styles
