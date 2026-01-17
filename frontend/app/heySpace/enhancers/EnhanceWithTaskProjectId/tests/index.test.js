import React from 'react';
import { shallow, mount } from 'enzyme';
import EnhanceWithTaskProjectId from 'enhancers/EnhanceWithTaskProjectId/index';
import { doNothing } from 'common/utils';
import stateMock from 'stateMock';
import { createMockStore } from 'redux-test-utils';
import { shallowWithStore } from 'enzyme-redux';
import Component from 'componentMock';
import * as ProjectConstants from 'models/domain/ProjectsModel/constants';

const Enhancer = EnhanceWithTaskProjectId(Component);
let wrapper;
let store;

describe('<EnhanceWithTaskProjectId>', () => {
  beforeEach(() => {
    store = createMockStore(stateMock);
    wrapper = shallowWithStore(<Enhancer />, store);
  });

  it('render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
