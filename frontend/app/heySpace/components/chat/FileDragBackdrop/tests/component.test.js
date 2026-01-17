import React from 'react'
import { shallow } from 'enzyme'

import FileDragBackdrop from '../component'

describe('<FileDragBackdrop />', () => {
  let wrapper

  beforeAll(() => {
    wrapper = shallow(<FileDragBackdrop/>)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
