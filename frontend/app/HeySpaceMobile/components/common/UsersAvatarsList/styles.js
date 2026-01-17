import { StyleSheet } from 'react-native'

import { whiteColor } from 'common/commonStyles/colors'

const styles = StyleSheet.create({
  component: {
    flexDirection: 'row',
    height: 36,
  },
  count: {
    height: 36,
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: whiteColor,
    borderRadius: 36,
  },
})

export default styles
