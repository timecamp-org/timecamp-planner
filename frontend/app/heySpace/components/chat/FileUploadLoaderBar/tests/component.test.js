import React from 'react'
import { shallow } from 'enzyme'
import FileUploadLoaderBar from '../component'

describe('<FileUploadLoaderBar />', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<FileUploadLoaderBar fileName='test' />)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
