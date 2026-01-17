import React from 'react';
import {
  Svg,
  Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Text,
  Use,
  Defs,
  Stop,
} from 'react-native-svg';

export default function RadioChecked(props) {
  return (
    <Svg height="23" width="22" viewBox="0 0 22 23">
      <G fill="none" fillRule="evenodd" transform="translate(1 1)">
        <Ellipse x="10" y="10.25" rx="10" ry="10.25" stroke="#BF8AC0" strokeWidth="2" />
        <Ellipse x="10" y="10.25" fill="#2d80eb" fillOpacity=".5" rx="6.25" ry="6.406" />
      </G>
    </Svg>
  );
}
