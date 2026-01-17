import isEqual from 'lodash/isEqual'
import reduce from 'lodash/reduce'
import { AnyDict } from '../types';

// Use this in shouldComponentUpdate to see if props are different. It prints shallow and deep difference in props. It returns true if props are deep different or false otherwise - boolean return is needed because React will yell at you if you don't return bool in shouldComponentUpdate
export default function(nextProps: AnyDict, currProps: AnyDict): boolean {
  if (nextProps !== currProps) {
    const isDeepEqual = isEqual(nextProps, currProps)
    console.log(`Properties are deep equal even tough shallowly different`, isDeepEqual)
    const shallowDifference = reduce(currProps, function(result, value, key) {
      return value === nextProps[key] ? result : result.concat({ key, currValue: currProps[key], nextValue: nextProps[key] })
    }, [])
    console.log('This props are shallow different', shallowDifference)
    if (!isDeepEqual) {
      const difference = reduce(currProps, function(result, value, key) {
        return isEqual(value, nextProps[key]) ?
          result : result.concat({ key, currValue: currProps[key], nextValue: nextProps[key] });
      }, [])
      console.log('This props are really different', difference)
    }
    return !isDeepEqual
  } else {
    return false
  }
}
