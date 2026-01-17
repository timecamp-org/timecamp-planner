
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

export default function ArrowRight(props) {
  return (
    <Svg viewBox="0 0 18 18" {...props.svgProps}>
    	<G fill="none" fillRule="evenodd" stroke={props.currentColor} strokeLinecap="round" strokeWidth="2.5">
    		<Path d="M2 9h14M9 2l7 7-7 7"/>
    	</G>
    </Svg>
  );
}
