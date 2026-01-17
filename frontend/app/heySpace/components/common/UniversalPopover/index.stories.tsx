import React from 'react';
import UniversalPopover from './index'
import Button from 'components/buttons/Button'

export default { 
  title: 'common/UniversalPopover' ,
};

export const topPosition = () =>
  <UniversalPopover 
    popperComponent={<span>TEST</span>}
    targetComponent={<Button>Im target!</Button>}
    isPopoverOpened={true}
    popperPlacement={'top'}
  />

