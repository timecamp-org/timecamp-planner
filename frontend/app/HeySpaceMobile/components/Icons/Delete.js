
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

export default function Delete(props) {
  return (
    <Svg viewBox="0 0 15 16" { ...props.svgProps }>
    	<G fill={props.currentColor} fillRule="evenodd">
    		<Path d="M14.52 14.735c-.683.683-1.838.636-2.58-.105L1.2 3.89C.46 3.15.413 1.994 1.097 1.31c.683-.683 1.838-.636 2.58.105l10.74 10.74c.74.741.788 1.896.104 2.58z"/>
    		<Path d="M.916 14.765c-.684-.683-.637-1.838.105-2.58l10.74-10.74c.741-.74 1.896-.788 2.58-.105.683.684.636 1.839-.106 2.58L3.495 14.66c-.74.741-1.896.789-2.58.105z"/>
    	</G>
    </Svg>
  );
}
