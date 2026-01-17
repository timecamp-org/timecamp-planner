import { useSelector } from 'common/hooks/useSelector'
import { selectFirstProjectData } from 'models/domain/ProjectsModel/selectors/sortedAvailableVisibleSpacesIdsSelector'
import getDefaultAppUrl from '../../utils/getDefaultAppUrl'

export default function useDefaultUrl(): string {
  const firstProjectData = useSelector(state => selectFirstProjectData(state))
  return getDefaultAppUrl({ firstProjectData })
}
