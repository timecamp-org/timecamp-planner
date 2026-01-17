import React from 'react';
import { shallow, mount } from 'enzyme';
import GoogleButton from 'commonComponents/GoogleButton/component';
import { doNothing } from 'common/utils';

describe('<GoogleButton>', () => {
  it('render', () => {
    const className = 'testClassName';
    const wrapper = shallow(<GoogleButton className={className} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('default props', () => {
    const wrapper = shallow(<GoogleButton />);
    const { props } = wrapper.instance();

    expect(props.className).toBeUndefined();
    expect(props.buttonText).toEqual('Login with Google');
    expect(props.isDisabled).toBeFalsy();
    expect(props.onClick).toEqual(doNothing);
  });

  it('onClick', () => {
    const onClick = jest.fn();
    const wrapper = shallow(<GoogleButton onClick={onClick} />);

    wrapper.simulate('click');

    expect(onClick).toHaveBeenCalled();
  });
});
