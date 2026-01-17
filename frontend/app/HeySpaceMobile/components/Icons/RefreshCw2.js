
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

export default function RefreshCw2(props) {
  return (
    <Svg height="15" width="18" viewBox="0 0 18 15">
    	<G fill="none" fillRule="evenodd" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5">
    		<Path d="M16 3v4h-4M2 13V9h4"/>
    		<Path d="M3.597 5.666c.656-1.78 2.218-3.113 4.136-3.53 1.918-.417 3.924.14 5.314 1.476L16 6.277M2 8.723l2.953 2.665c1.39 1.336 3.396 1.893 5.314 1.476 1.918-.417 3.48-1.75 4.136-3.53"/>
    	</G>
    </Svg>
  );
}
