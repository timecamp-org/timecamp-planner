import { StyleSheet } from 'react-native'
import {
  gridCellSize, boldFontWeight,
} from 'styles/common'
import { blueGreyColor, whiteColor } from 'common/commonStyles/colors'

const styles = StyleSheet.create({
  separator: {
    width: '100%',
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 2 * gridCellSize,
  },
  lineLeft: {
    height: 1,
    flex: 1,
    marginLeft: 2 * gridCellSize,
    backgroundColor: whiteColor,
  },
  lineRight: {
    height: 1,
    flex: 1,
    marginRight: 2 * gridCellSize,
    backgroundColor: whiteColor,
  },
  text: {
    color: blueGreyColor,
    fontWeight: boldFontWeight,
    flex: 2,
    textAlign: 'center',
  },
})

export default styles
