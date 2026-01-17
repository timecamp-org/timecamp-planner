import React from 'react'
import PropTypes from 'prop-types'
import ProjectColors from 'common/commonStyles/projectColors'

import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import Tick from 'Icons/Tick'
import { whiteTwoColor } from 'common/commonStyles/colors'
import styles from './styles'
import { doNothing } from 'common/utils'

SpaceColorEditor.propTypes = {
  selectedColor: PropTypes.string.isRequired,
  containerStyle: PropTypes.object,
  isDisabled: PropTypes.bool,
  onUpdateColor: PropTypes.func.isRequired,
}

SpaceColorEditor.defaultProps = {
  containerStyle: {},
  isDisabled: false,
  onUpdateColor: doNothing,
}

function SpaceColorEditor(props) {
  return (
    <View style={StyleSheet.flatten([styles.container, props.containerStyle || {}])}>
      {ProjectColors.projectColors.map(renderColorItem)}
    </View>
  )

  function renderColorItem(colorHex) {
    const isSelected = props.selectedColor === colorHex
    return (
      <View
        key={colorHex}
        style={props.isDisabled ? styles.disabledBackdrop : {}}
      >
        <TouchableWithoutFeedback
          disabled={props.isDisabled}
          onPress={() => props.onUpdateColor(colorHex)}
        >
          <View
            style={StyleSheet.flatten([
              styles.colorDot,
              isSelected ? styles.colorDotSelected : {},
              { backgroundColor: colorHex },
            ])}>
            {isSelected
              ? <Tick color={whiteTwoColor} />
              : null
            }
          </View>
        </TouchableWithoutFeedback>

      </View>
    )
  }
}

export default SpaceColorEditor
