import { StyleSheet } from 'react-native'
import { blueGreyColor, lightGreyColor, whiteTwoColor } from 'common/commonStyles/colors'
import { boldFontWeight, largeBorderRadius, mediumFontSize } from 'styles/common'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: lightGreyColor,
  },
  section: {
    padding: 10,
    marginBottom: 10,
    borderRadius: largeBorderRadius,
    backgroundColor: whiteTwoColor,
  },
  sectionTitle: {
    fontSize: mediumFontSize,
    fontWeight: boldFontWeight,
    color: blueGreyColor,
    marginBottom: 20,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 50,
  },
  button: {
    marginTop: 0,
    marginLeft: 10,
    width: 'auto',
    paddingHorizontal: 10,
  },
})

export default styles
