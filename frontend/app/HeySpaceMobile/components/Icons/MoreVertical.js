
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

export default function MoreVertical(props) {
  return (
    <Svg viewBox="0 0 3 15" {...props.svgProps}>
    	<G fill={props.currentColor} fillRule="evenodd">
    		<Rect height="3" width="3" rx="1.5" y="12"/>
    		<Rect height="3" width="3" rx="1.5" y="6"/>
    		<Rect height="3" width="3" rx="1.5"/>
    	</G>
    </Svg>
  );
}
