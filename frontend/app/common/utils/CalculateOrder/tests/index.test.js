import { List, Map } from 'immutable'
import calculateOrder, { ORDER_INTERVAL } from '../index'

const emptyItemsOrdersMap = new Map()

const itemsListInOrder = new List(['item::0', 'item::1', 'item::2'])
const itemsOrdersMap = new Map({
  'item::0': ORDER_INTERVAL,
  'item::1': ORDER_INTERVAL * 2,
  'item::2': ORDER_INTERVAL * 3,
})

const itemsOrdersMapWhereFirstHasOrderEqualOne = new Map({
  'item::0': 1,
  'item::1': ORDER_INTERVAL * 2,
  'item::2': ORDER_INTERVAL * 3,
})

const itemsOrdersMapWhereItemsOrderDifferByOne = new Map({
  'item::0': 1,
  'item::1': 2,
  'item::2': 3,
})

const newItemId = 'newItemId'

describe('Moving at the end of list', () => {
  it('return correct order', () => {
    const endOfListIndex = itemsListInOrder.size + 1
    const lastItemId = itemsListInOrder.last()
    const lastItemOrder = itemsOrdersMap.get(lastItemId)

    const updatedOrders = calculateOrder(newItemId, endOfListIndex, itemsOrdersMap)

    expect(updatedOrders.get(newItemId)).toBe(lastItemOrder + ORDER_INTERVAL)
    expect(updatedOrders.size).toBe(1)
  })
})

describe('Moving at the beginning of list where first item order is ', () => {
  it('different from 1 return correct order', () => {
    const beginningOfListIndex = 0
    const firstItemId = itemsListInOrder.first()
    const firstItemOrder = itemsOrdersMap.get(firstItemId)

    const updatedOrders = calculateOrder(newItemId, beginningOfListIndex, itemsOrdersMap)

    expect(updatedOrders.get(newItemId)).toBe(Math.round(firstItemOrder / 2))
    expect(updatedOrders.size).toBe(1)
  })

  it('1 return correct order', () => {
    const beginningOfListIndex = 0
    const firstItemId = itemsListInOrder.first()
    const firstItemOrder = itemsOrdersMapWhereFirstHasOrderEqualOne.get(firstItemId)

    const updatedOrders = calculateOrder(newItemId, beginningOfListIndex, itemsOrdersMapWhereFirstHasOrderEqualOne)

    expect(updatedOrders.size).toBe(itemsListInOrder.size + 1)
    updatedOrders.forEach((updatedOrder, id) => {
      if (id === newItemId) {
        expect(updatedOrder).toBe(firstItemOrder)
      } else {
        expect(updatedOrder).toBe(itemsOrdersMapWhereFirstHasOrderEqualOne.get(id) + ORDER_INTERVAL)
      }
    })
  })
})

describe('Moving in the middle of list ', () => {
  it('return correct order', () => {
    const middleIndex = 1
    const previousItemId = itemsListInOrder.get(middleIndex - 1)
    const previousItemOrder = itemsOrdersMap.get(previousItemId)
    const nextItemId = itemsListInOrder.get(middleIndex)
    const nextItemOrder = itemsOrdersMap.get(nextItemId)

    const updatedOrders = calculateOrder(newItemId, middleIndex, itemsOrdersMap)

    expect(updatedOrders.get(newItemId)).toBe((previousItemOrder + nextItemOrder) / 2)
    expect(updatedOrders.size).toBe(1)
  })

  it('with items order differing by 1 return correct order', () => {
    const middleIndex = 1
    const nextItemId = itemsListInOrder.get(middleIndex)
    const nextItemOrder = itemsOrdersMapWhereItemsOrderDifferByOne.get(nextItemId)

    const updatedOrders = calculateOrder(newItemId, middleIndex, itemsOrdersMapWhereItemsOrderDifferByOne)

    expect(updatedOrders.size).toBe((itemsListInOrder.size - middleIndex) + 1)
    updatedOrders.forEach((updatedOrder, id) => {
      if (id === newItemId) {
        expect(updatedOrder).toBe(nextItemOrder)
      } else {
        expect(updatedOrder).toBe(itemsOrdersMapWhereItemsOrderDifferByOne.get(id) + ORDER_INTERVAL)
      }
    })
  })
})

describe('Moving to empty list ', () => {
  it('return correct order', () => {
    const index = 0

    const updatedOrders = calculateOrder(newItemId, index, emptyItemsOrdersMap)

    expect(updatedOrders.get(newItemId)).toBe(ORDER_INTERVAL)
    expect(updatedOrders.size).toBe(1)
  })
})

describe('Moving in the same list ', () => {
  it('to the beginning return correct order', () => {
    const index = 0
    const itemId = itemsListInOrder.get(1)
    const firstItemId = itemsListInOrder.first()
    const firstItemOrder = itemsOrdersMap.get(firstItemId)

    const updatedOrders = calculateOrder(itemId, index, itemsOrdersMap)

    expect(updatedOrders.get(itemId)).toBe(Math.round(firstItemOrder / 2))
    expect(updatedOrders.size).toBe(1)
  })

  it('to the middle return correct order', () => {
    const itemId = itemsListInOrder.get(0)
    const middleIndex = 1
    const previousItemId = itemsListInOrder.get(middleIndex)
    const previousItemOrder = itemsOrdersMap.get(previousItemId)
    const nextItemId = itemsListInOrder.get(middleIndex + 1)
    const nextItemOrder = itemsOrdersMap.get(nextItemId)

    const updatedOrders = calculateOrder(itemId, middleIndex, itemsOrdersMap)

    expect(updatedOrders.get(itemId)).toBe(Math.round((nextItemOrder + previousItemOrder) / 2))
    expect(updatedOrders.size).toBe(1)
  })

  it('to the end return correct order', () => {
    const itemId = itemsListInOrder.get(0)
    const endOfListIndex = itemsListInOrder.size
    const lastItemId = itemsListInOrder.last()
    const lastItemOrder = itemsOrdersMap.get(lastItemId)

    const updatedOrders = calculateOrder(itemId, endOfListIndex, itemsOrdersMap)

    expect(updatedOrders.get(itemId)).toBe(lastItemOrder + ORDER_INTERVAL)
    expect(updatedOrders.size).toBe(1)
  })
})
