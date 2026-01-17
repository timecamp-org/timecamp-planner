import { Id } from 'common/utils/identifier'

export function makeFilterId(userId: Id, containerType: string, containerId: Id): Id {
  if (containerId) {
    return `filter::${containerType}::${containerId}::${userId}`
  } else {
    return `filter::${containerType}::${userId}`
  }
}

export function getFilterContainerType(filterId: Id): string {
  const { containerType } = getFilterIdParts(filterId)
  return containerType
}

export function getFilterContainerId(filterId: Id): Id {
  const { containerId } = getFilterIdParts(filterId)
  return containerId
}

interface FilterIdPartsInterface {
  containerType: string,
  containerId?: Id,
  userId?: Id,
}

function getFilterIdParts(filterId: Id): FilterIdPartsInterface {
  const parts = filterId.split('::')
  if (parts.length === 4) {
    const [domain, containerType, containerId, userId] = parts
    return {
      containerId,
      containerType,
      userId
    }
  } else {
    const [domain, containerType, userId] = parts
    return {
      containerType,
      userId
    }
  }
}