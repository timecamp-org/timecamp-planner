import createImmutableEqualSelector from '../../../../utils/createImmutableEqualSelector'
import { selectSortedAvailableVisibleSpacesIds } from './sortedAvailableVisibleSpacesIdsSelector'
import { selectProjectNames } from './domain'

// This selector returns normal JS objects because component using it cannot work with Immutable data
export const selectSpacePickerItemsData = createImmutableEqualSelector(
  selectSortedAvailableVisibleSpacesIds,
  selectProjectNames,
  (spaceIds, spaceNames) => spaceIds
    .reduce(
      (acc, spaceId) => acc
        .concat({ label: spaceNames.get(spaceId), value: spaceId, key: spaceId })
      , [],
    ),
)
