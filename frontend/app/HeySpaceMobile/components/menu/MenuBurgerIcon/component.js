import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'

import { View, TouchableOpacity } from 'react-native'
import Badge from '../../notifications/Badge'
import { coralPinkColor, darkTwoColor } from 'common/commonStyles/colors'

MenuBurgerIcon.propTypes = {
  unreadMessagesCount: PropTypes.number,
  onPress: PropTypes.func.isRequired,
}

MenuBurgerIcon.defaultProps = {
  unreadMessagesCount: 0,
}

function MenuBurgerIcon(props) {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <View style={styles.burger}>
        <View style={styles.iconPart} />
        <View style={styles.iconPart} />
        <View style={styles.iconPart} />
        {props.unreadMessagesCount > 0
          ? <Badge count={props.unreadMessagesCount} color={coralPinkColor} textColor={darkTwoColor} style={styles.badge} />
          : null
        }
      </View>
    </TouchableOpacity>
  )
}

export default MenuBurgerIcon
