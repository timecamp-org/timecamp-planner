import React, { FC, PropsWithChildren } from 'react';
import SecondaryButton from 'components/buttons/SecondaryButton';

import { Video } from 'commonComponents/Icons/fontawesome/Video';
import TooltipedHoveredComponent from 'commonComponents/TooltipedHoveredComponent';
import { useTranslation } from 'i18n';
import { doNothing } from 'common/utils';
import { Id } from 'common/utils/identifier';
import useComponent from './hook';
import TooltipedDisabledElement from 'commonComponents/TooltipedDisabledElement';

export type MeetControllerInterface = {
  objectId: Id;
  className?: string;
  buttonClassName?: string;
  color?: string;
  onClick?: VoidFunction;
};

const defaultProps = {
  onClick: doNothing,
};

const MeetController: FC<MeetControllerInterface> = (props) => {
  const { isMeetsEnabled, onClick } = useComponent(props);

  return (
    <>
      <Wrapper {...props}>
        <SecondaryButton
          color={props.color}
          className={props.buttonClassName}
          onClick={onClick}
          isDisabled={!isMeetsEnabled}
        >
          <Video width={18} height={18} color={'var(--color-gray-900)'} />
        </SecondaryButton>
      </Wrapper>
    </>
  );
};

function Wrapper(props: PropsWithChildren<MeetControllerInterface>) {
  const { isMeetsEnabled } = useComponent(props);

  const { t } = useTranslation();

  if (isMeetsEnabled) {
    return (
      <TooltipedHoveredComponent message={t('Communicate using Planner Meets')}>
        {props.children}
      </TooltipedHoveredComponent>
    );
  } else {
    return (
      <TooltipedDisabledElement
        isDisabled={!isMeetsEnabled}
        message={t(`To use our awesome Planner Meets upgrade to Premium!`)}
      >
        {props.children}
      </TooltipedDisabledElement>
    );
  }
}

MeetController.defaultProps = defaultProps;

export default MeetController;
