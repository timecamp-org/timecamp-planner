import React from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity, Text } from 'react-native'

import styles from './styles'
import { whiteColor, whiteTwoColor, blueGreyColor } from 'common/commonStyles/colors';

CardDetailsProgress.propTypes = {
  taskColor: PropTypes.string.isRequired,
  taskProgress: PropTypes.number.isRequired,

  onTaskProgressChange: PropTypes.func.isRequired,
}

CardDetailsProgress.defaultProps = {

}

export default function CardDetailsProgress(props) {
  return (
    <View style={styles.component}>
      <TouchableOpacity style={{
        ...styles.leftItem,
        backgroundColor: props.taskColor,
      }}
        onPress={() => props.onTaskProgressChange(0)}
      >
        <Text style={{ ...styles.text, color: whiteTwoColor }}>
          {'0%'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={{
        ...styles.middleItem,
        backgroundColor: props.taskProgress >= 25 ? props.taskColor : whiteColor,
      }}
        onPress={() => props.onTaskProgressChange(25)}
      >
        <Text
          style={{ ...styles.text, color: props.taskProgress >= 25 ? whiteTwoColor : blueGreyColor }}
        >
          {'25%'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={{
        ...styles.middleItem,
        backgroundColor: props.taskProgress >= 50 ? props.taskColor : whiteColor,
      }}
        onPress={() => props.onTaskProgressChange(50)}
      >
        <Text
          style={{ ...styles.text, color: props.taskProgress >= 50 ? whiteTwoColor : blueGreyColor }}
        >
          {'50%'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={{
        ...styles.middleItem,
        backgroundColor: props.taskProgress >= 75 ? props.taskColor : whiteColor,
      }}
        onPress={() => props.onTaskProgressChange(75)}
      >
        <Text
          style={{ ...styles.text, color: props.taskProgress >= 75 ? whiteTwoColor : blueGreyColor }}
        >
          {'75%'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={{
        ...styles.rightItem,
        backgroundColor: props.taskProgress === 100 ? props.taskColor : whiteColor,
      }}
        onPress={() => props.onTaskProgressChange(100)}
      >
        <Text
          style={{ ...styles.text, color: props.taskProgress >= 100 ? whiteTwoColor : blueGreyColor }}
        >
          {'100%'}
        </Text>
      </TouchableOpacity>
    </View>
  )

}
