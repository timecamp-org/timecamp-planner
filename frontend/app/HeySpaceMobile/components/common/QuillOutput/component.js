import React from 'react'
import { View, Text, FlatList } from 'react-native'
import PropTypes from 'prop-types'

export default function QuillOutput(props) {
  return (
    <View>
      <Text>
        {props.text}
      </Text>
    </View>
  )
}
