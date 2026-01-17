
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

export default function ArrowUp(props) {
  return (
    <Svg height="18" width="18" viewBox="0 0 18 18">
    	<G fill="none" fillRule="evenodd" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5">
    		<Path d="M9 16V2M2 9l7-7 7 7"/>
    	</G>
    </Svg>
  );
}
