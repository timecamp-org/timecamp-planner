import { useSelector } from 'common/hooks/useSelector'
import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { onProjectUpdate } from 'models/domain/ProjectsModel/actions'
import { selectProjectDescription } from 'models/domain/ProjectsModel/selectors'
import { ProjectDescriptionTextAreaInterface } from '.'

export type DataProviderHookInterface = {
  projectDescription: string,
}

export const useDataProvider = (props: ProjectDescriptionTextAreaInterface): DataProviderHookInterface => ({
  projectDescription: useSelector(state => selectProjectDescription(state, { projectId: props.projectId })),
})

export type DataPersisterHookInterface = {
  onPersistProjectUpdate: (fields: Record<string, unknown>) => void
}

export const useDataPersister = (props: ProjectDescriptionTextAreaInterface): DataPersisterHookInterface => {
  const dispatch = useDispatch()

  const onPersistProjectUpdate = useCallback((fields = {}) => {
    dispatch(onProjectUpdate(props.projectId, fields, true))
  }, [dispatch, props.projectId])

  return {
    onPersistProjectUpdate
  }
}
