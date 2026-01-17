import React from 'react'
import PropTypes from 'prop-types'
import { doNothing } from 'common/utils'

import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import IOSSettingsDivider from '../../settings/IOSSettingsDivider'
import TickIOS from 'Icons/TickIOS'
import styles from './styles'
import { cloudyBlueColor } from 'common/commonStyles/colors'

ManageSpaceColor.propTypes = {
  selectedColor: PropTypes.string.isRequired,
  colorsWithNames: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  isProjectEditable: PropTypes.bool,
  onChangeSpaceColor: PropTypes.func,
}

ManageSpaceColor.defaultProps = {
  isProjectEditable: true,
  onChangeSpaceColor: doNothing,
}

function ManageSpaceColor(props) {
  function renderColorItem({ color, name }) {
    return (
      <View style={styles.colorItemWrapper} key={color}>
        <TouchableOpacity
          disabled={!props.isProjectEditable}
          onPress={() => props.onChangeSpaceColor(color)}
          style={styles.colorItem}
        >
          <View style={StyleSheet.flatten([styles.colorSquare, { backgroundColor: color }])} />
          <Text style={styles.colorName}>{name}</Text>
          {props.selectedColor === color
            ? <TickIOS
              style={styles.selectedMark}
              color={props.isProjectEditable ? undefined : cloudyBlueColor}
            />
            : null
          }
        </TouchableOpacity>
        <IOSSettingsDivider fullWidth />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <IOSSettingsDivider fullWidth />
      {props.colorsWithNames.map(renderColorItem)}
    </ScrollView>
  )
}

export default ManageSpaceColor
