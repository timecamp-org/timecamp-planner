import React from 'react'
import { shallow } from 'enzyme'
import TaskNameInput from 'components/tasks/taskName/TaskNameInput/component'

describe('<TaskNameInput>', () => {
  const taskId = 'task::0'
  const taskName = ''
  let onFocus
  let onBlur
  let onKeyDown
  let onKeyUp
  let onTaskUpdateName
  let wrapper

  beforeEach(() => {
    onFocus = jest.fn()
    onBlur = jest.fn()
    onKeyDown = jest.fn()
    onKeyUp = jest.fn()
    onTaskUpdateName = jest.fn()

    wrapper = shallow(<TaskNameInput
      taskId={taskId}
      taskName={taskName}

      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onTaskUpdateName={onTaskUpdateName}
    />)
  })

  it('render', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('onFocus', () => {
    wrapper.find('input').simulate('focus')

    expect(onFocus).toHaveBeenCalled()
  })

  it('onBlur', () => {
    wrapper.find('input').simulate('blur')

    expect(onBlur).toHaveBeenCalled()
  })

  it('onKeyDown', () => {
    wrapper.find('input').simulate('keydown')

    expect(onKeyDown).toHaveBeenCalled()
  })

  it('onKeyUp', () => {
    wrapper.find('input').simulate('keyup')

    expect(onKeyUp).toHaveBeenCalled()
  })

  it('onTaskUpdateName', () => {
    const inputValue = 'inputValue'
    const event = { target: { value: inputValue } }
    wrapper.find('input').simulate('change', event)

    expect(onTaskUpdateName).toHaveBeenCalledWith(event)
  })
})
