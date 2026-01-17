import { StyleSheet } from 'react-native'
import { whiteTwoColor, purpleHeartColor } from 'common/commonStyles/colors'
import { gridCellSize, fontFamilyFour } from 'styles/common'

const styles = StyleSheet.create({
  Component: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: whiteTwoColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    marginBottom: 4 * gridCellSize,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 8 * gridCellSize,
    height: 8 * gridCellSize,
  },
  text: {
    marginLeft: gridCellSize,
    color: purpleHeartColor,
    fontSize: gridCellSize * 6,
    fontFamily: fontFamilyFour,
  },
})

export default styles
