
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

export default function ArrowLeft(props) {
  return (
    <Svg viewBox="0 0 18 18" { ...props.svgProps }>
    	<G fillRule="evenodd" stroke={props.currentColor} strokeLinecap="round" strokeWidth="2.5">
    		<Path d="M16 9H2M9 16L2 9l7-7"/>
    	</G>
    </Svg>
  );
}
