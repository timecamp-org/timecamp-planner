import React from 'react';
import { shallow } from 'enzyme';
import TaskProgressEstimateEditable from '../TaskProgressEstimateEditable/component';

import { progressOptions } from '../enhancers/EnhanceTaskProgressEstimateEditable';

describe('<TaskProgressEstimateEditable />', () => {
  const mouseLeaveMock = jest.fn();
  const wrapper = shallow(
    <TaskProgressEstimateEditable
      progressEstimateThresholdOptions={progressOptions}
      onMouseLeaveProgressBar={mouseLeaveMock}
    />
  );

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should fire mouseLeave function on mouse leave event', () => {
    wrapper.simulate('mouseEnter');
    expect(mouseLeaveMock).not.toHaveBeenCalled();
    wrapper.simulate('mouseLeave');
    expect(mouseLeaveMock).toHaveBeenCalledTimes(1);
  });
});
