import React from 'react'
import { Text, View, Modal, TouchableHighlight, StyleSheet } from 'react-native'
import styles from './styles'
import PropTypes from 'prop-types'
import { doNothing } from 'common/utils'
import { whiteColor } from 'common/commonStyles/colors'

ActionSheet.propTypes = {
  options: PropTypes.array,
  disabledIndexes: PropTypes.array,
  isVisible: PropTypes.bool,
  title: PropTypes.element,
  onClose: PropTypes.func,
  onSelectOption: PropTypes.func,
}

ActionSheet.defaultProps = {
  options: [],
  disabledIndexes: [],
  isVisible: false,
  onClose: doNothing,
  onSelectOption: doNothing,
}

export default function ActionSheet(props) {
  return (
    <Modal
      visible={props.isVisible}
      animationType='none'
      transparent
      onRequestClose={props.onClose}
    >
      <View style={styles.wrapper}>
        <Text
          style={styles.overlay}
          onPress={props.onClose}
        />
        <View
          style={styles.body}
        >
          {props.title && renderTitle(props.title)}
          {renderOptions(props)}
          {renderCancelButton(props.onClose)}
        </View>
      </View>
    </Modal>
  )
}

function renderTitle(title) {
  return (<View style={styles.titleBox}>
    <Text style={styles.titleText}>{title}</Text>
  </View>)
}

function renderOptions({ options, onSelectOption, disabledIndexes }) {
  return (<View style={styles.options}>
    {options.map(renderOption)}
  </View>)

  function renderOption(option, index, array) {
    const style = index === array.length - 1
      ? StyleSheet.flatten([styles.buttonBox, styles.lastButton])
      : styles.buttonBox

    return (<TouchableHighlight
      key={index}
      style={style}
      onPress={() => onSelectOption(index)}
      disabled={disabledIndexes.indexOf(index) > -1}
      underlayColor={whiteColor}
    >
      {option}
    </TouchableHighlight>)
  }
}

function renderCancelButton(onClose) {
  return (<TouchableHighlight
    activeOpacity={1}
    style={styles.cancelButtonBox}
    onPress={onClose}
  >
    <Text style={styles.cancelButtonBoxText}>{'Close'}</Text>
  </TouchableHighlight>)
}
