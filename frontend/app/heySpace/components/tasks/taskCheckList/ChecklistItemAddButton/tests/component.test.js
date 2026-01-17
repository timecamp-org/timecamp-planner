import React from 'react'
import { shallow } from 'enzyme'

import ChecklistItemAddButton from 'ChecklistItemAddButton/component'

describe('<ChecklistItemAddButton />', () => {
  it('should render', () => {
    const wrapper = shallow(<ChecklistItemAddButton taskId={'task::001'}/>)
    expect(wrapper).toMatchSnapshot()
  })
})
