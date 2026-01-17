import { DataProviderHookInterface } from './dataHooks'
import { BadgeInterface } from './index'

export function useDataProvider(props: BadgeInterface): DataProviderHookInterface {
  return {
    counter: props.counter,
    color: props.color,
    innerRef: props.innerRef
  }
}