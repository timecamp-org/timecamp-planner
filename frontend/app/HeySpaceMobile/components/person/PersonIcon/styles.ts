import { StyleSheet } from 'react-native'

import { whiteTwoColor, blueGreyColor, lightGreenColor, slate60Color } from 'common/commonStyles/colors'

const indicator = {
  borderWidth: 3,
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: blueGreyColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    color: whiteTwoColor,
  },
  online: {
    ...indicator,
    borderColor: lightGreenColor,
  },
  offline: {
    ...indicator,
    borderColor: slate60Color,
  },
  deactivated: {
    opacity: 0.15,
  },
})

export default styles
