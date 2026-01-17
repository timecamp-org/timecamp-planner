import React from 'react'
import { shallow } from 'enzyme'
import MaterialSwitch from 'commonComponents/MaterialSwitch/component'

describe('<MaterialSwitch />', () => {
  let wrapper

  const renderComponent = (props = {}) => {
    wrapper = shallow(<MaterialSwitch {...props} />)
  }

  it('render', () => {
    renderComponent()
    expect(wrapper).toMatchSnapshot()
  })

  it('onClick', () => {
    const onClickMock = jest.fn()
    renderComponent({ onClick: onClickMock })
    wrapper.simulate('click')
    expect(onClickMock).toHaveBeenCalled()
  })
})
