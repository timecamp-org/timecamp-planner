import React from 'react';
import { shallow, mount } from 'enzyme';
import EnhanceProjectNameIO from '../index';
import { doNothing } from 'common/utils';
import { Map } from 'immutable';
import stateMock from 'stateMock';
import Component from 'componentMock';

const Enhancer = EnhanceProjectNameIO(Component);
let wrapper;
let store;
const mockEvent = { target: { value: 'test' } };

describe('<EnhanceProjectNameIO>', () => {
  beforeEach(() => {
    wrapper = shallow(<Enhancer projectId={'project::testRoot1'} />, store);
  });

  it('render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('onClick', () => {
    const component = wrapper.instance();
    component.onClick(mockEvent);
    expect(component.state.showProjectNameInput).toBeTruthy();
  });

  it('should call onBlur', () => {
    const onBlur = jest.fn();
    wrapper.setProps({ onBlur });
    const component = wrapper.instance();
    component.onClick(mockEvent);
    component.onBlur(mockEvent);
    expect(component.state.showProjectNameInput).toBeFalsy();
    expect(onBlur).toHaveBeenCalled();
  });

  it('should call onKeyDown case key is not Enter', () => {
    const onKeyDown = jest.fn();
    const mockEventKey = { key: 'test' };
    wrapper.setProps({ onKeyDown });
    const component = wrapper.instance();
    component.onClick(mockEvent);
    component.onKeyDown(mockEventKey);
    expect(component.state.showProjectNameInput).toBeTruthy();
    expect(onKeyDown).toHaveBeenCalled();
  });

  it('should call onKeyDown case key is Enter', () => {
    const onKeyDown = jest.fn();
    const mockEventKey = { key: 'Enter' };
    wrapper.setProps({ onKeyDown });
    const component = wrapper.instance();
    component.onClick(mockEvent);
    component.onKeyDown(mockEventKey);
    expect(component.state.showProjectNameInput).toBeFalsy();
    expect(onKeyDown).toHaveBeenCalled();
  });
});
