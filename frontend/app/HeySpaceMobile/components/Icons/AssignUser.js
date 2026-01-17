
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

export default function AssignUser(props) {
  return (
    <Svg viewBox="0 0 23 18" {...props.svgProps}>
    	<G fill="none" fillRule="evenodd" transform="translate(2 2)">
    		<Circle x="6" y="3" r="3" stroke={props.currentColor} strokeWidth="2.5"/>
    		<Path d="M12 13c0-3.513-2.686-6-6-6s-6 2.534-6 6c0 1.011 12 1.043 12 0z" stroke={props.currentColor} strokeWidth="2.5"/>
    		<Rect height="8" width="2" fill={props.currentColor} rx="1" transform="rotate(90 17 7)" x="16" y="3"/>
    		<Rect height="8" width="2" fill={props.currentColor} rx="1" transform="rotate(-180 17 7)" x="16" y="3"/>
    	</G>
    </Svg>
  );
}
