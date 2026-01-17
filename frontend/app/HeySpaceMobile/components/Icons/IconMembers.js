import React from 'react'
import { Svg, Circle, G, Path } from 'react-native-svg'
import PropTypes from 'prop-types'
import { wisteriaColor } from 'common/commonStyles/colors'
import { StyleSheet } from 'react-native'

IconMembers.propTypes = {
  color: PropTypes.string,
  style: PropTypes.object,
}

IconMembers.defaultProps = {
  color: wisteriaColor,
  style: {},
}

export default function IconMembers(props) {
  return (
    <Svg style={StyleSheet.flatten([{ height: 18, width: 16 }, props.style])} viewBox="0 0 16 18">
    	<G fill="none" fillRule="evenodd" stroke={props.color} strokeWidth="2.5" transform="translate(2 2)">
    		<Circle x="6" y="3" r="3"/>
    		<Path d="M12 13c0-3.513-2.686-6-6-6s-6 2.534-6 6c0 1.011 12 1.043 12 0z"/>
    	</G>
    </Svg>
  )
}
