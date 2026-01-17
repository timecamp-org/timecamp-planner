
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

export default function Shield(props) {
  return (
    <Svg height="18" width="15" viewBox="0 0 15 18">
    	<Path d="M7.6 16s5.6-2.8 5.6-7V4.1L7.6 2 2 4.1V9c0 4.2 5.6 7 5.6 7z" fill="none" fillRule="evenodd" stroke="#7088A1" strokeLinecap="round" strokeWidth="2.5"/>
    </Svg>
  );
}
