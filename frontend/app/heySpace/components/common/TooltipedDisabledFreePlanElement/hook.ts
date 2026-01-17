export type TooltipedDisabledFreePlanElementHookInterface = {
  isDisabled: boolean,
}

export function useComponent(): TooltipedDisabledFreePlanElementHookInterface {
  return {
    isDisabled: false,
  }
}