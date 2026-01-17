import React from 'react'
import { shallow } from 'enzyme'

import { List } from 'immutable'

import TaskChecklist from 'TaskChecklist/component'

describe('<TaskChecklist />', () => {
  it('should render when list is empty', () => {
    const wrapper = shallow(<TaskChecklist taskId={'task::001'}/>)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render list', () => {
    const checklistItemsIdsMock = List.of('checklistItem::001', 'checklistItem::002', 'checklistItem::003')
    const wrapper = shallow(<TaskChecklist taskId={'task::001'} checklistItemsIds={checklistItemsIdsMock} />)
    expect(wrapper).toMatchSnapshot()
  })

})
