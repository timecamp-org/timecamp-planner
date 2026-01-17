import React from 'react'
import PropTypes from 'prop-types'
import {
  Svg,
  Circle,
  G,
  Path,
} from 'react-native-svg'
import { wisteriaColor } from 'common/commonStyles/colors'
import { StyleSheet } from 'react-native'

Settings.propTypes = {
  color: PropTypes.string,
  style: PropTypes.object,
}

Settings.defaultProps = {
  color: wisteriaColor,
  style: {},
}

export default function Settings(props) {
  return (
    <Svg style={StyleSheet.flatten([{ height: 18, width: 18 }, props.style])} viewBox="0 0 18 18">
    	<G fill="none" fillRule="evenodd" stroke={props.color} transform="translate(2 2)">
    		<Circle x="7" y="7" r="2" strokeLinecap="round" strokeWidth="2"/>
    		<Path d="M11.71 8.91a1.05 1.05 0 0 0 .21 1.157l.037.038a1.273 1.273 0 1 1-1.8 1.801l-.039-.038a1.05 1.05 0 0 0-1.158-.21 1.05 1.05 0 0 0-.636.961v.108a1.273 1.273 0 1 1-2.546 0v-.057a1.05 1.05 0 0 0-.687-.96 1.05 1.05 0 0 0-1.158.21l-.038.037a1.273 1.273 0 1 1-1.801-1.8l.038-.039c.3-.307.383-.765.21-1.158a1.05 1.05 0 0 0-.961-.636h-.108a1.273 1.273 0 0 1 0-2.546h.057a1.05 1.05 0 0 0 .96-.687 1.05 1.05 0 0 0-.21-1.158l-.037-.038a1.273 1.273 0 1 1 1.8-1.801l.039.038c.307.3.765.383 1.158.21h.05a1.05 1.05 0 0 0 .637-.961v-.108a1.273 1.273 0 0 1 2.546 0v.057c.001.419.251.796.636.96.393.174.851.091 1.158-.21l.038-.037a1.273 1.273 0 1 1 1.801 1.8l-.038.039a1.05 1.05 0 0 0-.21 1.158v.05c.165.386.543.636.961.637h.108a1.273 1.273 0 1 1 0 2.546h-.057a1.05 1.05 0 0 0-.96.636z" strokeWidth="2.2"/>
    	</G>
    </Svg>
  )
}
