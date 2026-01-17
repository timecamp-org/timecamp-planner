import { Map, List } from 'immutable'
import { Id } from '../identifier'

export const ORDER_INTERVAL = 65536
const emptyMap = Map<Id, number>()

export default function (
  itemId: Id,
  destinationIndex: number,
  destinationListItemOrders: Map<Id, number>,
): Map<Id, number> {
  const filteredDestinationListItemOrders = destinationListItemOrders
    .filter((order, id) => id !== itemId && order !== null)
    .sort() as Map<Id, number>

  const destinationListItemIdsInOrder = filteredDestinationListItemOrders.keySeq().toList()

  if (destinationListItemIdsInOrder.size === 0) {
    return calculateIfMovingToEmptyList(itemId)
  }

  if ((destinationIndex + 1) > destinationListItemIdsInOrder.size) {
    return calculateIfMovingToTheEndOfList(itemId, filteredDestinationListItemOrders, destinationListItemIdsInOrder)
  }

  const nextItemId = destinationListItemIdsInOrder.get(destinationIndex)
  const nextItemOrder = filteredDestinationListItemOrders.get(nextItemId)

  if (destinationIndex === 0) {
    return calculateIfMovingInTheBeginningOfList(itemId, filteredDestinationListItemOrders, nextItemOrder)
  }

  return calculateIfMovingInTheMiddleOfList(itemId, filteredDestinationListItemOrders, destinationListItemIdsInOrder, destinationIndex, nextItemOrder)
}

function calculateIfMovingInTheBeginningOfList(
  itemId: Id,
  destinationListItemOrders: Map<Id, number>,
  nextItemOrder: number
): Map<Id, number> {
  const order = Math.round((nextItemOrder) / 2)
  let updatedOrders = Map({ [itemId]: order })

  if (order === nextItemOrder) {
    updatedOrders = updatedOrders.merge(updateConflictingOrders(destinationListItemOrders, order))
  }

  return updatedOrders
}

function calculateIfMovingToTheEndOfList(
  itemId: Id,
  destinationListItemOrders: Map<Id, number>,
  destinationListItemIdsInOrder: List<Id>
): Map<Id, number> {
  const lastItemOrder = destinationListItemOrders.get(destinationListItemIdsInOrder.last())
  return Map({ [itemId]: lastItemOrder + ORDER_INTERVAL })
}

function calculateIfMovingToEmptyList(itemId: Id): Map<Id, number> {
  return Map({ [itemId]: ORDER_INTERVAL })
}

function calculateIfMovingInTheMiddleOfList(
  itemId: Id,
  destinationListItemOrders: Map<Id, number>,
  destinationListItemIdsInOrder: List<Id>,
  destinationIndex: number,
  nextItemOrder: number,
): Map<Id, number> {
  const previousItemId = destinationListItemIdsInOrder.get(destinationIndex - 1)
  const previousItemOrder = destinationListItemOrders.get(previousItemId)

  const order = Math.round((previousItemOrder + nextItemOrder) / 2)
  let updatedOrders = Map({ [itemId]: order })

  if (order === nextItemOrder) {
    updatedOrders = updatedOrders.merge(updateConflictingOrders(destinationListItemOrders, order))
  }

  return updatedOrders
}

function updateConflictingOrders(
  destinationListItemOrders: Map<Id, number>,
  order: number
): Map<Id, number> {
  return destinationListItemOrders
    .filter((value) => value >= order)
    .map((value) => value + ORDER_INTERVAL) as Map<Id, number>
}

export function attachOrdersToUnorderedItems(
  itemIds: List<Id>,
): Map<Id, number> {
  let itemOrders = emptyMap
  let prevOrder = 0
  itemIds.forEach(itemId => {
    const newOrder = prevOrder + ORDER_INTERVAL
    itemOrders = itemOrders.set(itemId, newOrder)
    prevOrder = newOrder
  })
  return itemOrders
}
