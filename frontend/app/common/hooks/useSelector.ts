import { ApplicationState } from 'common/types'
import { TypedUseSelectorHook, useSelector as useReduxSelector } from 'react-redux'

export const useSelector: TypedUseSelectorHook<ApplicationState> = useReduxSelector