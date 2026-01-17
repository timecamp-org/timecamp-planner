
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

export default function Add(props) {
  return (
    <Svg viewBox="0 0 17 16" {...props.svgProps}>
    	<G fill={props.currentColor} fillRule="evenodd">
    		<Path d="M16.564 7.9c0 .828-.716 1.5-1.6 1.5h-12.8c-.884 0-1.6-.672-1.6-1.5s.716-1.5 1.6-1.5h12.8c.884 0 1.6.672 1.6 1.5z"/>
    		<Path d="M8.5 16c-.828 0-1.5-.716-1.5-1.6V1.6C7 .716 7.672 0 8.5 0S10 .716 10 1.6v12.8c0 .884-.672 1.6-1.5 1.6z"/>
    	</G>
    </Svg>
  );
}
