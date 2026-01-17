import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  colorDot: {
    width: 40,
    height: 40,
    marginRight: 15,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  colorDotSelected: {
    transform: ([{ scale: 1.5 }]),
  },
  disabledBackdrop: {
    opacity: 0.5,
  },
})

export default styles
