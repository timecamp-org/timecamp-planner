import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { wisteriaColor } from 'common/commonStyles/colors'

import { View, Text } from 'react-native'

Tag.propTypes = {
  tagName: PropTypes.string,
  tagColor: PropTypes.string,
}

function Tag(props) {
  return (
    <View
      ref={props.innerRef}
      style={{
        ...styles.container,
        backgroundColor: props.tagColor || wisteriaColor,
      }}
    >
      <Text style={styles.text} numberOfLines={1}>
        {props.tagName}
      </Text>
    </View>
  )
}

export default Tag
