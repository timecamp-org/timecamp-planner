import React from 'react';
import { Svg, Path, G, Circle } from 'react-native-svg';
import PropTypes from 'prop-types';
import { wisteriaColor } from 'common/commonStyles/colors';

Send.propTypes = {
  color: PropTypes.string,
  style: PropTypes.object,
  strokeWidth: PropTypes.number,
};

Send.defaultProps = {
  color: wisteriaColor,
  style: {
    width: 30,
    height: 30,
  },
  strokeWidth: 2.5,
};

export default function Send(props) {
  return (
    <Svg style={props.style} viewBox="0 0 30 30" stroke-width={props.strokeWidth}>
      <G fill="none" fill-rule="evenodd">
        <Circle cx="15" cy="15" r="15" fill="#2d80eb" fill-rule="nonzero" />
        <G stroke="#FFF" stroke-linecap="round" stroke-linejoin="round" strokeWidth={props.strokeWidth}>
          <Path d="M21 9l-7.7 7.7M21 9l-4.9 14-2.8-6.3L7 13.9z" />
        </G>
      </G>
    </Svg>
  );
}
