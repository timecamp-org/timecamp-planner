import { FC, ReactNode } from 'react';

import { HourGlassHalf } from 'commonComponents/Icons/fontawesome/HourGlassHalf';
import { PropertyButton } from 'components/buttons/PropertyButton';

interface ToggleTooltipButtonInterface {
  hasEstimate: boolean;
  isActive: boolean;
  onClick: () => void;
  color: string;
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'xs' | 'xxs';
}

export const ToggleTooltipButton: FC<ToggleTooltipButtonInterface> = ({
  onClick,
  children,
  hasEstimate,
  isActive,
  className,
  size = 'sm',
}) => {
  const isDisabled = false;

  return (
    <PropertyButton
      hasProperty={hasEstimate}
      onClick={onClick}
      isDisabled={isDisabled}
      isActive={isActive}
      icon={<HourGlassHalf size={size} />}
      className={className}
    >
      <span>{children}</span>
    </PropertyButton>
  );
};
