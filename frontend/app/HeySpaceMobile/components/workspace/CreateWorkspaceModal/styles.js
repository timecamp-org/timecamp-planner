import { StyleSheet } from 'react-native'
import { blueGreyColor, whiteTwoColor } from 'common/commonStyles/colors'
import { boldFontWeight, largerFontSize, mediumFontSize } from 'styles/common'

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    margin: 0,
  },
  modalContent: {
    margin: 20,
    flex: 1,
    backgroundColor: whiteTwoColor,
  },
  top: {
    width: '100%',
    flexDirection: 'row',
  },
  closeIcon: {
    marginLeft: 'auto',
  },
  innerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: largerFontSize,
    fontWeight: boldFontWeight,
    color: blueGreyColor,
    textAlign: 'center',
    marginBottom: 30,
  },
  description: {
    fontSize: mediumFontSize,
    color: blueGreyColor,
    marginBottom: 30,
  },
  button: {
    marginTop: 30,
  },
})

export default styles
