
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

export default function Edit(props) {
  return (
    <Svg height="16" width="16" viewBox="0 0 16 16">
    	<Path d="M1.926 10.737l3.536 3.535-1.319 1.319-3.252-.283-.283-3.253 1.318-1.318zm1.06-1.06L11.994.67a1.5 1.5 0 0 1 1.19-.434l1.302.114a1.5 1.5 0 0 1 1.364 1.364l.113 1.301a1.5 1.5 0 0 1-.433 1.19l-9.007 9.007-3.535-3.536z" fill="currentColor" fillRule="evenodd"/>
    </Svg>
  );
}
