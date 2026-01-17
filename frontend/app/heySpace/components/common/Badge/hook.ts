import { RefObject, useEffect } from 'react';

import { getDataHookByObjectContainer } from './dataHooks';

import { BadgeInterface } from '.';

export type BadgeHookInterface = {
  counter: number;
  color?: string;
  isBiggerThanZero?: boolean;
  innerRef?: RefObject<HTMLDivElement>;
};

export function useComponent(props: BadgeInterface): BadgeHookInterface {
  const { useDataProvider } = getDataHookByObjectContainer(props);
  const { counter, color, innerRef } = useDataProvider(props);
  const { onCounterChange } = props;

  useEffect(() => {
    onCounterChange?.(counter);
  }, [onCounterChange, counter]);

  return {
    counter,
    color,
    isBiggerThanZero: counter > 0,
    innerRef,
  };
}
