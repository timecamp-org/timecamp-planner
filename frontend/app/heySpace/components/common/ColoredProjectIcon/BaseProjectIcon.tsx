import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import * as icons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getIconTypeName } from './helpers';
export enum ProjectIconTypes {
  PenFancy = 'PenFancy',
  Trophy = 'Trophy',
  MugHot = 'MugHot',
  SackDollar = 'SackDollar',
  PaperclipVertical = 'PaperclipVertical',
  FloppyDisk = 'FloppyDisk',
  BusinessTime = 'BusinessTime',
  BullseyeArrow = 'BullseyeArrow',
  Envelope = 'Envelope',
}

export function BaseProjectIcon({
  iconType,
  color,
  size,
  width,
}: {
  iconType?: ProjectIconTypes;
  color?: string;
  size?: SizeProp;
  width?: number;
}): JSX.Element {
  const iconTypeName = getIconTypeName(iconType);
  const selectedIcon = icons[iconTypeName];

  return <FontAwesomeIcon icon={selectedIcon} color={color} size={size} width={width} />;
}
