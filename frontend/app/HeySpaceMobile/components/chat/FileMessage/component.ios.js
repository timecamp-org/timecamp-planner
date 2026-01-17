import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'

import File from '../../Icons/File'
import ActionSheet from '../../kanban/ActionSheet'
import styles from './styles'
import { blueGreyColor } from 'common/commonStyles/colors'
import { doNothing } from 'common/utils'

FileMessage.propTypes = {
  fileName: PropTypes.string.isRequired,
  actionSheetOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  isActionSheetOpen: PropTypes.bool,
  destructiveOptions: PropTypes.arrayOf(PropTypes.string).isRequired,

  onCloseActionSheet: PropTypes.func,
  onPress: PropTypes.func.isRequired,
}

FileMessage.defaultProps = {
  fileName: '',
  isActionSheetOpen: false,

  onPress: doNothing,
  onCloseActionSheet: doNothing,
  onSelectActionSheetOption: doNothing,
}

export default function FileMessage(props) {
  function renderOption(option) {
    const isDestructiveOption = props.destructiveOptions.includes(option)
    return <Text style={StyleSheet.flatten([styles.option, isDestructiveOption ? styles.optionDestructive : null])}>{option}</Text>
  }

  return (
    <React.Fragment>
      <TouchableOpacity style={styles.component} onPress={props.onPress}>
        <File style={styles.fileIcon} color={blueGreyColor} />
        <Text style={styles.name}>{props.fileName}</Text>
      </TouchableOpacity>
      <ActionSheet
        title={'Choose an option:'}
        isVisible={props.isActionSheetOpen}
        options={props.actionSheetOptions.map(renderOption)}
        onClose={props.onCloseActionSheet}
        onSelectOption={props.onSelectActionSheetOption}
      />
    </React.Fragment>
  )
}
