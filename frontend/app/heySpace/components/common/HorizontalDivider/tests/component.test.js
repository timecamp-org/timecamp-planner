import React from 'react'
import { shallow } from 'enzyme'

import HorizontalDivider from '../component'

describe('<HorizontalDivider />', () => {

  it('should render correctly', () => {
    const wrapper = shallow(<HorizontalDivider />)
    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.hasClass('horizontalDivider')).toBeTruthy()
  })

  it('should apply className prop', () => {
    const className = 'testClassName'
    const wrapper = shallow(<HorizontalDivider className={className} />)
    expect(wrapper.hasClass(className)).toBeTruthy()
  })
})