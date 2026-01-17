import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'

import File from '../../Icons/File'
import styles from './styles'
import { blueGreyColor } from 'common/commonStyles/colors'
import { doNothing } from 'common/utils'

FileMessage.propTypes = {
  fileName: PropTypes.string,
  onClick: PropTypes.func,
  onLongPress: PropTypes.func,
}

FileMessage.defaultProps = {
  fileName: '',
  onClick: doNothing,
  onLongPress: doNothing,
}

export default function FileMessage(props) {
  return (
    <TouchableOpacity
      style={styles.component}
      onPress={props.onLongPress}
      onLongPress={props.onLongPress}
    >
      <File style={styles.fileIcon} color={blueGreyColor} />
      <Text style={styles.name}>{props.fileName}</Text>
    </TouchableOpacity>
  )
}
