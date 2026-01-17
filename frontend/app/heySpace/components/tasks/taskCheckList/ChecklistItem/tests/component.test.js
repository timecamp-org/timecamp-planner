import React from 'react'
import { shallow } from 'enzyme'

import ChecklistItem from 'ChecklistItem/component'

describe('<ChecklistItem />', () => {
  it('should render', () => {
    const wrapper = shallow(<ChecklistItem checklistItemId={'checklistItem::test'} />)
    expect(wrapper).toMatchSnapshot()
  })
})