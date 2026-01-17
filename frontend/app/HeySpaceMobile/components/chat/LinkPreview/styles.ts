import { StyleSheet } from 'react-native'
import { boldFontWeight, gridCellSize } from '../../../styles/common'
import { cloudyBlue30Color, blueGreyColor } from '../../../../common/commonStyles/colors';

const styles = StyleSheet.create({
  Component: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: gridCellSize,
  },
  previewContainer: {
    marginTop: 2 * gridCellSize,
    paddingLeft: 3 * gridCellSize,
    borderLeftColor: cloudyBlue30Color,
    borderLeftWidth: 4
  },
  publisher: {
    display: 'flex',
    color: blueGreyColor,
    paddingVertical: gridCellSize,
  },
  logo: {
    width: 3 * gridCellSize,
    height: 3 * gridCellSize,
    marginRight: gridCellSize,
  },
  title: {
    fontWeight: boldFontWeight,
    paddingBottom: gridCellSize,
  },
  image: {
    marginTop: 3 * gridCellSize, 
  },
})

export default styles