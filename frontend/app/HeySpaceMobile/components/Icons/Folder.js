
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

export default function Folder(props) {
  return (
    <Svg height="14" width="17" viewBox="0 0 17 14">
    	<G fill="none" fillRule="evenodd">
    		<Path d="M8.724 3.818L7.828 2h-4.93A.9.9 0 0 0 2 2.905v8.19c0 .5.403.905.894.905h11.212a.9.9 0 0 0 .894-.907V4.725c0-.5-.402-.907-.9-.907H8.725z" fillRule="nonzero" stroke="#B9C3CE" strokeWidth="2.5"/>
    		<Path d="M3 3.1h11v2H3z" fill="#B9C3CE"/>
    	</G>
    </Svg>
  );
}
