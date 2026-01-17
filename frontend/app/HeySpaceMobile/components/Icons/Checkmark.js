
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
  Stop
} from 'react-native-svg';

export default function Checkmark(props) {
  return (
    <Svg height="13" width="18" viewBox="0 0 18 13">
    	<Path d="M16 2l-9.625 9.625L2 7.25" fill="none" fillRule="evenodd" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5"/>
    </Svg>
  );
}
