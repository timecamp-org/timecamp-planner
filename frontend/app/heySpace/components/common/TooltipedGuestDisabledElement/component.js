import React from 'react';

import TooltipedDisabledElement from 'commonComponents/TooltipedDisabledElement';
import { useTranslation } from 'i18n';

export default function TooltipedGuestDisabledElement(props) {
  const { t } = useTranslation();

  return (
    <TooltipedDisabledElement
      isDisabled={props.isDisabled}
      message={t(`This feature is not available for guests`)}
    >
      {props.children(props)}
    </TooltipedDisabledElement>
  );
}
