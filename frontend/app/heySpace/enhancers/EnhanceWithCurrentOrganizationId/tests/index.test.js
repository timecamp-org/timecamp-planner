import React from 'react'
import { createMockStore } from 'redux-test-utils'
import { shallowWithStore } from 'enzyme-redux'
import stateMock from 'stateMock'

import EnhanceWithCurrentOrganizationId from 'enhancers/EnhanceWithCurrentOrganizationId/index'

describe('EnhanceWithCurrentOrganizationId', () => {
  const store = createMockStore(stateMock)
  const ComposedComponent = () => <div />
  const Enhancer = EnhanceWithCurrentOrganizationId(ComposedComponent)

  it('should render', () => {
    const wrapper = shallowWithStore(<Enhancer />, store)
    expect(wrapper).toMatchSnapshot()
  })
})

