import React from 'react';
import { shallow, mount } from 'enzyme';
import ProjectNameIO from 'components/projects/projectName/ProjectNameIO/component';
import { doNothing } from 'common/utils';

describe('<ProjectNameIO>', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<ProjectNameIO projectId={'project::testRoot1'} />);
  });

  it('render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('onClick', () => {
    const onClick = jest.fn();
    wrapper.setProps({ onClick });
    const element = wrapper.find('.projectNameWithDot');
    element.simulate('click');
    expect(onClick).toHaveBeenCalled();
  });
});
