import { LegacyRef, useState } from 'react';

import { Instance, Placement, State } from '@popperjs/core';
import { has } from 'lodash';
import { usePopper } from 'react-popper';

import { AnyDict } from 'common/types';

type PopperDataInterface = {
  styles: { [key: string]: React.CSSProperties };
  attributes: { [key: string]: { [key: string]: string } };
  state: State | null;
  update: Instance['update'] | null;
  forceUpdate: Instance['forceUpdate'] | null;
};

type Modifier = {
  name: string;
  options: AnyDict;
};

export type UseUniversalPopoverHookInterface = {
  popperData: PopperDataInterface;
  onSetReferenceElement: LegacyRef<HTMLDivElement>;
  onSetPopperElement: LegacyRef<HTMLDivElement>;
  onSetArrowElement: LegacyRef<HTMLDivElement>;
};

const DEFAULT_FALLBACK_PLACEMENT = {
  name: 'flip',
  options: {
    fallbackPlacements: ['top', 'left', 'right'],
  },
};

export default function useUniversalPopover(
  popperModifiers: AnyDict = {},
  shouldRenderArrow: boolean = false,
  popperPlacement: Placement = 'bottom',
  scrollContainerId?: string
): UseUniversalPopoverHookInterface {
  const transformedModifiers = transformModifiers(popperModifiers);

  const [referenceElement, onSetReferenceElement] = useState(null);
  const [popperElement, onSetPopperElement] = useState(null);
  const [arrowElement, onSetArrowElement] = useState(null);

  if (!has(popperModifiers, 'options.fallbackPlacements')) {
    transformedModifiers.push(DEFAULT_FALLBACK_PLACEMENT);
  }

  if (shouldRenderArrow) {
    transformedModifiers.push({
      name: 'arrow',
      options: {
        element: arrowElement,
        padding: 8,
      },
    });
  }

  if (scrollContainerId) {
    transformedModifiers.push({
      name: 'preventOverflow',
      options: { boundariesElement: document.getElementById(scrollContainerId) },
    });
  }

  const popperData = usePopper(referenceElement, popperElement, {
    modifiers: transformedModifiers,
    placement: popperPlacement,
  });

  return {
    popperData,
    onSetReferenceElement,
    onSetPopperElement,
    onSetArrowElement,
  };
}
function transformModifiers(popperModifiers: AnyDict = {}): Modifier[] {
  return Object.keys(popperModifiers).map((optionName) => {
    let options = popperModifiers[optionName];
    if (optionName === 'offset' && typeof options.offset === 'string') {
      const [skidding, distance]: number[] = options.offset
        .split(',')
        .map((value) => parseInt(value.replace('px', '')));
      options = {
        ...options,
        offset: [skidding, distance],
      };
    }
    return {
      name: optionName,
      options,
    };
  });
}
