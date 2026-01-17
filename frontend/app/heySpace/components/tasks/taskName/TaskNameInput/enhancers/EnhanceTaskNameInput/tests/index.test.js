import React from 'react'
import EnhanceTaskNameInput from '../index'
import stateMock from 'stateMock'
import { createMockStore } from 'redux-test-utils'
import { shallowWithStore } from 'enzyme-redux'
import Component from 'componentMock'

import * as TasksModelActions from 'models/domain/TasksModel/actions'

jest.useFakeTimers()

describe('<EnhanceTaskNameInput>', () => {
  const Enhancer = EnhanceTaskNameInput(Component)
  const store = createMockStore(stateMock)
  const taskId = 'task::1'

  const wrapper = shallowWithStore(
    <Enhancer
      taskId={taskId}
    />, store)

  it('render', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('onTaskUpdateName', () => {
    const enhancer = wrapper.dive().instance()
    const taskName = 'test'
    const labelName = 'test:'

    const taskEvent = { target: { value: taskName } }
    const labelEvent = { target: { value: labelName } }

    enhancer.onTaskUpdateName(taskEvent)

    expect(store.isActionTypeDispatched(TasksModelActions.updateName().type)).toBeTruthy()

    enhancer.onTaskUpdateName(labelEvent)

    expect(store.isActionTypeDispatched(TasksModelActions.updateName().type)).toBeTruthy()
  })
})
