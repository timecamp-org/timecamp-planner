import { makeIsRightPanelOpenedId } from 'common/utils/generateLocalStorageId'
import { Id } from '../../../../../common/utils/identifier'

export const getIsRightPanelOpened = (projectId: Id) => {
  const storedValue = localStorage.getItem(makeIsRightPanelOpenedId(projectId))
  return storedValue === null ? false : JSON.parse(storedValue)
}

export const onSetIsRightPanelOpened = (projectId: Id, isRightPanelOpened: boolean) => {
  localStorage.setItem(makeIsRightPanelOpenedId(projectId), JSON.stringify(isRightPanelOpened))
}
