import { List } from 'immutable'
import calculateSourceIndexBySublistItemIndex from '../index'

const originalList = new List(['item::0', 'item::1', 'item::2', 'item::3', 'item::4'])

describe('Calculate index to insert at when filtered list not matching original', () => {
  describe('and has previous and next items', () => {
    it('and is from another list returns correct index', () => {
      const itemId = 'item::15'
      const filteredList = new List(['item::1', 'item::4'])
      const desiredIndex = 1
      const indexToInsertAt = calculateSourceIndexBySublistItemIndex(itemId, desiredIndex, originalList, filteredList)
      expect(indexToInsertAt).toBe(2)
    })
    it('and is from same list returns correct index', () => {
      const itemId = 'item::1'
      const filteredList = new List(['item::1', 'item::3', 'item::4'])
      const desiredIndex = 1
      const indexToInsertAt = calculateSourceIndexBySublistItemIndex(itemId, desiredIndex, originalList, filteredList)
      expect(indexToInsertAt).toBe(3)
    })
  })

  describe('and has only next item', () => {
    it('and is from another list returns correct index', () => {
      const itemId = 'item::15'
      const filteredList = new List(['item::3'])
      const desiredIndex = 0
      const indexToInsertAt = calculateSourceIndexBySublistItemIndex(itemId, desiredIndex, originalList, filteredList)
      expect(indexToInsertAt).toBe(3)
    })
    it('and is from same list returns correct index', () => {
      const itemId = 'item::3'
      const filteredList = new List(['item::1', 'item::3'])
      const desiredIndex = 0
      const indexToInsertAt = calculateSourceIndexBySublistItemIndex(itemId, desiredIndex, originalList, filteredList)
      expect(indexToInsertAt).toBe(1)
    })
  })

  describe('and has only previous item', () => {
    it('and is from another list returns correct index', () => {
      const itemId = 'item::15'
      const filteredList = new List(['item::3'])
      const desiredIndex = 1
      const indexToInsertAt = calculateSourceIndexBySublistItemIndex(itemId, desiredIndex, originalList, filteredList)
      expect(indexToInsertAt).toBe(4)
    })
    it('and is from same list returns correct index', () => {
      const itemId = 'item::1'
      const filteredList = new List(['item::1', 'item::3'])
      const desiredIndex = 1
      const indexToInsertAt = calculateSourceIndexBySublistItemIndex(itemId, desiredIndex, originalList, filteredList)
      expect(indexToInsertAt).toBe(3)
    })
  })
  it('and filtered list is empty returns correct index', () => {
    const itemId = 'item::15'
    const filteredList = new List([])
    const desiredIndex = 0
    const indexToInsertAt = calculateSourceIndexBySublistItemIndex(itemId, desiredIndex, originalList, filteredList)
    expect(indexToInsertAt).toBe(0)
  })
})

describe('Calculate index to insert at when filtered list is matching original', () => {
  it('returns correct index', () => {
    const itemId = 'item::15'
    const desiredIndex = 3
    const indexToInsertAt = calculateSourceIndexBySublistItemIndex(itemId, desiredIndex, originalList, originalList)
    expect(indexToInsertAt).toBe(desiredIndex)
  })
})
