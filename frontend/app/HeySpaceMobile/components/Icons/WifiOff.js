
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

export default function WifiOff(props) {
  return (
    <Svg height="20" width="20" viewBox="0 0 20 20">
    	<G fill="none" fillRule="evenodd" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5">
    		<Path d="M2 2l16 16M13.433 9.316c.595.291 1.152.655 1.658 1.084M4.91 10.4a7.956 7.956 0 0 1 3.76-1.738M9.062 4.945a11.636 11.636 0 0 1 8.633 2.873M2.305 7.818a11.57 11.57 0 0 1 3.419-2.094M7.476 12.99a4.364 4.364 0 0 1 5.055 0"/>
    	</G>
    </Svg>
  );
}
