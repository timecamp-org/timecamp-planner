import React from 'react'
import PropTypes from 'prop-types'
import { Svg, G, Path } from 'react-native-svg'

import { wisteriaColor } from 'common/commonStyles/colors'

X.propTypes = {
  color: PropTypes.string,
}

X.defaultProps = {
  color: wisteriaColor,
}

export default function X(props) {
  return (
    <Svg style={props.style || { width: 18, height: 18 }} viewBox="0 0 15 16">
      <G fill={props.color} fillRule="evenodd">
        <Path d="M14.52 14.735c-.683.683-1.838.636-2.58-.105L1.2 3.89c-.74-.74-.787-1.896-.103-2.58.683-.683 1.838-.636 2.58.105l10.74 10.74c.74.741.788 1.896.104 2.58h-.001z" />
        <Path d="M.916 14.765c-.684-.683-.637-1.838.105-2.58l10.74-10.74c.741-.74 1.896-.788 2.58-.105.683.684.636 1.839-.106 2.58L3.495 14.66c-.74.741-1.896.789-2.58.105h.001z" />
      </G>
    </Svg>
  )
}
