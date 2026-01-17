import { useDispatch } from 'react-redux';
import { useCallback, useEffect, useRef } from 'react';
import { useSelector } from './useSelector';
import { selectIsUserIdle, selectIsPageVisible } from 'models/domain/AppModel/selectors'
import { extractParamsToInject, InjectedParam } from 'common/utils';
import { AppEventType, AnyDict } from 'common/types';
import { AppEventEmitter } from 'common/services';
import { ActionCreator } from 'typesafe-actions';

export type RefreshControllerOptions = {
  action: ActionCreator,
  paramsToInject: InjectedParam[],
  isArgumentsValid?: (params: AnyDict) => boolean,
}

export default function useRefreshData(
  props: AnyDict,
  options: RefreshControllerOptions,
) {
  const { action, paramsToInject, isArgumentsValid = () => true} = options
  const isUserIdle = useSelector(selectIsUserIdle)
  const isPageVisible = useSelector(selectIsPageVisible)
  const dispatch = useDispatch()
  const args = extractParamsToInject(paramsToInject, props)
  const sheduledReconnect = useRef(false)
  
  const onFetchData = useCallback(() => {
    sheduledReconnect.current = false
    if (isArgumentsValid(props)) {
      dispatch(action(...args))
    }
  }, [dispatch, args])
  
  const onAppReconnected = useCallback(() => {
    sheduledReconnect.current = true
    if (!isUserIdle && isPageVisible) {
      onFetchData()
    }
  }, [isUserIdle, isPageVisible, onFetchData])

  useEffect(() => {
    AppEventEmitter.on(AppEventType.APP_RECONNECTED, onAppReconnected)
    return () => {
      AppEventEmitter.off(AppEventType.APP_RECONNECTED, onAppReconnected)
    }
  }, [])

  useEffect(() => {
    if (sheduledReconnect.current && !isUserIdle && isPageVisible) {
      onFetchData()
    }
  }, [isUserIdle, isPageVisible, sheduledReconnect.current])

}