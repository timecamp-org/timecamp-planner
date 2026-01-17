import { StyleSheet } from 'react-native'

import {
  whiteTwoColor,
  blueGreyColor,
} from 'common/commonStyles/colors'
import {
  boldFontWeight,
  gridCellSize,
  largerFontSize,
} from 'styles/common'

const styles = StyleSheet.create({
  Component: {
    backgroundColor: whiteTwoColor,
    padding: 4 * gridCellSize,
    height: '100%',
    width: '100%',
  },
  header: {
    marginTop: 11 * gridCellSize,
    marginBottom: 4 * gridCellSize,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: largerFontSize,
    fontWeight: boldFontWeight,
    color: blueGreyColor,
  },
  avatar: {
    height: (8 * gridCellSize),
    width: (8 * gridCellSize),
    borderRadius: (4 * gridCellSize),
    marginRight: (2 * gridCellSize),
  },
})

export default styles
