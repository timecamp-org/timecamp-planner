import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { TouchableOpacity } from 'react-native'
import Popover from 'react-native-popover-view'

import styles from './styles'
import { doNothing } from 'common/utils';

PopoverMenu.propTypes = {
  items: PropTypes.oneOfType([
    ImmutablePropTypes.list,
    PropTypes.array,
  ]).isRequired,
  headerRenderer: PropTypes.func,
  footerRenderer: PropTypes.func,
  from: PropTypes.object.isRequired,
}

PopoverMenu.defaultProps = {
  headerRenderer: doNothing,
  footerRenderer: doNothing,
}

const animationConfig = {
  duration: 200,
}

export default function PopoverMenu(props) {
  return (
    <Popover
      popoverStyle={styles.popover}
      animationConfig={animationConfig}
      from={props.from}
      {...props}
    >
      {props.headerRenderer()}
      {props.items.map((item, index) => {
        const key = typeof item === 'string' ? item : item.key
        return (
          <TouchableOpacity
            key={`popoverItem_${key}`}
            style={props.itemStyle ? props.itemStyle : styles.item}
            onPress={() => props.onItemClick(item, index)}
          >
            {props.itemRenderer(item)}
          </TouchableOpacity>
        )
      })}
      {props.footerRenderer()}
    </Popover>
  )
}
