import { StyleSheet } from 'react-native'
import { lightGreyColor, blueGreyColor } from 'common/commonStyles/colors'
import { gridCellSize, mediumFontSize, smallFontSize, boldFontWeight } from '../../../styles/common'
import { isIphoneX } from '../../../utils/iphoneX'

const chevron = {
  width: gridCellSize * 3,
  height: gridCellSize * 2,
}

const styles = StyleSheet.create({
  container: {
    margin: gridCellSize * 5,
    marginTop: (isIphoneX() ? 0 : gridCellSize * 5),
    flexDirection: 'row',
  },
  chevronContainer: {
    justifyContent: 'center',
    marginRight: gridCellSize * 2,
  },
  chevron,
  chevronSelected: {
    ...chevron,
    transform: ([{ rotate: '180deg' }]),
  },
  right: {
    marginLeft: gridCellSize * 4,
    marginRight: 'auto',
  },
  username: {
    color: lightGreyColor,
    fontSize: mediumFontSize,
    fontWeight: boldFontWeight,
  },
  organizationName: {
    color: blueGreyColor,
    fontSize: smallFontSize,
    fontWeight: boldFontWeight,
  },
})

export default styles
