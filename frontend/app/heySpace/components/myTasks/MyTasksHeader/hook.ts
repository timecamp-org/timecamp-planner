import { useParams } from 'react-router'
import { AnyDict } from 'common/types'
import { MyTasksPanelType } from '../types'

type MyTasksHeaderHookInterface = {
  myTasksPanelType: MyTasksPanelType,
}

export default function useComponent(): MyTasksHeaderHookInterface {
  const params = useParams<AnyDict>()

  return {
    myTasksPanelType: params.myTasksPanelType,
  }
}