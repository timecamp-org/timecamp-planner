import React from 'react'
import EnhanceChecklistItem from '../index'
import stateMock from 'stateMock'
import { createMockStore } from 'redux-test-utils'
import { shallowWithStore } from 'enzyme-redux'
import Component from 'componentMock'
import { doNothing } from 'common/utils'

import * as ChecklistModelActions from 'models/domain/ChecklistsModel/actions'
import * as ChecklistModelConstants from 'models/domain/ChecklistsModel/constants'

describe('<EnhanceChecklistItem>', () => {
  const Enhancer = EnhanceChecklistItem(Component)
  let wrapper
  let store

  beforeEach(() => {
    store = createMockStore(stateMock)
  })

  it('should render', () => {
    wrapper = shallowWithStore(<Enhancer taskId={'task::002'} checklistItemId={'checklistItem::test'} />, store)
    expect(wrapper).toMatchSnapshot()
  })

  it('sets inner ref', () => {
    const wrapperInstance = shallowWithStore(<Enhancer taskId={'task::002'} checklistItemId={'checklistItem::test'} />, store).dive().instance()

    expect(wrapperInstance._inputRef).toBe(null)
    const innerRefMock = {}
    wrapperInstance.innerRef(innerRefMock)
    expect(wrapperInstance._inputRef).toBe(innerRefMock)
  })

  it('should focus just created checklistItems on mount', () => {
    const checklistItemId = 'checklistItem::justCreated'
    const wrapperInstance = shallowWithStore(<Enhancer taskId={'task::001'} checklistItemId={checklistItemId} />, store).dive().instance()

    const innerRefMock = {
      isFocusedMock: false,
      focus: function () {
        this.isFocusedMock = true
      },
    }
    wrapperInstance.innerRef(innerRefMock)
    wrapperInstance.componentDidMount()

    expect(wrapperInstance._inputRef.isFocusedMock).toBe(true)
    expect(store.isActionDispatched(ChecklistModelActions.onNewChecklistItemSeen(checklistItemId)))
  })

  it('onChangeChecklistItemStatus', () => {
    const checkedValue = true
    const eventMock = {
      target: {
        checked: checkedValue,
      },
    }

    wrapper = shallowWithStore(<Enhancer taskId={'task::002'} checklistItemId={'checklistItem::test'} />, store)
    wrapper.dive().instance().onChangeChecklistItemStatus(eventMock)
    expect(store.isActionTypeDispatched(ChecklistModelConstants.onChangeChecklistItemData)).toBe(true)
  })

  it('onChangeChecklistItemText', () => {
    const checklistItemId = 'checklistItem::test'
    const testValueMock = 'checklistItem::test'
    const eventMock = {
      target: {
        value: testValueMock,
      },
    }

    wrapper = shallowWithStore(<Enhancer taskId={'task::002'} checklistItemId={checklistItemId} />, store)
    wrapper.dive().instance().onChangeChecklistItemText(eventMock)
    expect(store.isActionDispatched(ChecklistModelActions.onChangeChecklistItemText(checklistItemId, testValueMock))).toBe(true)
  })

  describe('onKeyDown', () => {
    describe('Enter', () => {
      it('should create new checklist item on Enter key down', () => {
        const taskId = 'task::002'
        const checklistItemId = 'checklistItem::test'
        const eventMock = {
          key: 'Enter',
          preventDefault: doNothing,
        }

        wrapper = shallowWithStore(<Enhancer taskId={taskId} checklistItemId={checklistItemId} />, store)
        wrapper.dive().instance().onKeyDown(eventMock)
        expect(store.isActionDispatched(ChecklistModelActions.onAddItemToChecklist(taskId, checklistItemId))).toBe(true)
      })

      it('should NOT create new checklist item on Enter+shift key down', () => {
        const taskId = 'task::002'
        const checklistItemId = 'checklistItem::test'
        const eventMock = {
          key: 'Enter',
          shiftKey: true,
          preventDefault: doNothing,
        }

        wrapper = shallowWithStore(<Enhancer taskId={taskId} checklistItemId={checklistItemId} />, store)
        wrapper.dive().instance().onKeyDown(eventMock)
        expect(store.isActionDispatched(ChecklistModelActions.onAddItemToChecklist(taskId, checklistItemId))).toBe(false)
      })
    })

    describe('Backspace', () => {
      let onDeleteChecklistItemCallbackMock

      beforeEach(() => {
        onDeleteChecklistItemCallbackMock = jest.fn()
      })

      it('should NOT fire callback and dispatch remove checklist item action if checklist item text is not empty', () => {
        const taskId = 'task::002'
        const checklistItemId = 'checklistItem::test'
        const eventMock = {
          key: 'Backspace',
          preventDefault: doNothing,
        }

        wrapper = shallowWithStore(<Enhancer taskId={taskId} checklistItemId={checklistItemId} onDeleteChecklistItemCallback={onDeleteChecklistItemCallbackMock} />, store)
        wrapper.dive().instance().onKeyDown(eventMock)

        expect(onDeleteChecklistItemCallbackMock).not.toHaveBeenCalled()
        expect(store.isActionDispatched(ChecklistModelActions.onRemoveItemFromChecklist(taskId, checklistItemId))).toBe(false)
      })

      it('should dispatch remove checklist item action if checklist item text is empty', () => {
        const taskId = 'task::001'
        const checklistItemId = 'checklistItem::emptyText'
        const eventMock = {
          key: 'Backspace',
          preventDefault: doNothing,
        }

        wrapper = shallowWithStore(<Enhancer taskId={taskId} checklistItemId={checklistItemId} onDeleteChecklistItemCallback={onDeleteChecklistItemCallbackMock} />, store)
        wrapper.dive().instance().onKeyDown(eventMock)

        expect(onDeleteChecklistItemCallbackMock).toHaveBeenCalledTimes(1)
        expect(store.isActionDispatched(ChecklistModelActions.onRemoveItemFromChecklist(taskId, checklistItemId))).toBe(true)
      })
    })
  })
})
