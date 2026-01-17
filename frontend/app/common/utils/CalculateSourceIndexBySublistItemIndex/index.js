export default function calculateSourceIndexBySublistItemIndex(itemId, desiredIndex, list, filteredList) {
  if (list.size === filteredList.size) {
    return desiredIndex
  }

  filteredList = filteredList.filter(id => id !== itemId)
  list = list.filter(id => id !== itemId)

  if (filteredList.isEmpty()) {
    return 0
  }

  if (hasPreviousItem(desiredIndex, filteredList)) {
    const previousInFilteredListItemId = filteredList.get(desiredIndex - 1)
    const previousItemIndexInList = list.indexOf(previousInFilteredListItemId)
    return previousItemIndexInList + 1
  }

  const nextInFilteredListItemId = filteredList.get(desiredIndex)
  const nextItemIndexInList = list.indexOf(nextInFilteredListItemId)
  return nextItemIndexInList
}

function hasPreviousItem(desiredIndex, list) {
  const previousIndex = desiredIndex - 1
  return previousIndex >= 0 && list.has(previousIndex)
}
