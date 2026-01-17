
import React from 'react';
import { RightPanelIconOrComponentType } from '../types';

export const isFunctionComponent = (DictOrComponent: RightPanelIconOrComponentType): DictOrComponent is React.FC => {
  
  return typeof DictOrComponent==='function'
};
