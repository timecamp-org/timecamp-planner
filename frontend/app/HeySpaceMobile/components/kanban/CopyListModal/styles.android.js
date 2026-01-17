import { StyleSheet } from 'react-native'

import {
  wisteriaColor,
  whiteTwoColor,
  blackColor,
} from 'common/commonStyles/colors'
import {
  gridCellSize,
  largeFontSize,
} from 'styles/common'

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  component: {
    backgroundColor: whiteTwoColor,
    padding: 4 * gridCellSize,
  },
  header: {
    fontSize: largeFontSize,
    color: blackColor,
  },
  content: {
    justifyContent: 'center',
  },
  label: {
    marginTop: 2 * gridCellSize,
  },
  picker: {
    width: '100%',
  },
  textInput: {
    width: '100%',
    marginTop: 2 * gridCellSize,
    marginBottom: 2 * gridCellSize,
  },
  footer: {
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginTop: 2 * gridCellSize,
  },
  footerButtonText: {
    padding: gridCellSize,
    fontSize: largeFontSize,
    color: wisteriaColor,
  },
})

export default styles
