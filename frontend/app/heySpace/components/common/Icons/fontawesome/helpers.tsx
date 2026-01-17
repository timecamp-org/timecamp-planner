import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';

import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { FigmaIconSizeProp } from 'app/heySpace/theme/types';

export type FigmaFontAwesomeIconProps = Omit<FontAwesomeIconProps, 'size'> & {
  size: FigmaIconSizeProp;
};

type GenerateIconComponentType = (icon: IconDefinition) => (props: Partial<FigmaFontAwesomeIconProps>) => JSX.Element;

const convertFigmaToFontAwesomeIconSize = (figmaIconSize: FigmaIconSizeProp): SizeProp => {
  if (figmaIconSize === 'xxs') {
    return '2xs';
  }
  return figmaIconSize;
};

export const generateIconComponent: GenerateIconComponentType =
  (icon) =>
  ({ size, ...rest }) => (
    <FontAwesomeIcon
      icon={icon}
      size={size ? convertFigmaToFontAwesomeIconSize(size) : 'lg'}
      fill="currentColor"
      {...rest}
    />
  );
