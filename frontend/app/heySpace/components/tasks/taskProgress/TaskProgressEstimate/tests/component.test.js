import React from 'react';
import { shallow } from 'enzyme';
import TaskProgressEstimate from '../TaskProgressEstimate/component';

describe('<TaskProgressEstimate />', () => {
  // TODO: (via KD docs) use this after some onboarding is added to app and users will know the difference between editable and non editable progress bar
  // it('should render TaskProgressEstimateNonEditable when current user is not a task follower', () => {
  //   const wrapper = shallow(<TaskProgressEstimate taskId={'test'} isCurrentUserTaskFollower={false} />)
  //
  //   expect(wrapper).toMatchSnapshot()
  // })

  // it('should render TaskProgressEstimateEditable when current user is a task follower', () => {
  //   const wrapper = shallow(<TaskProgressEstimate taskId={'test'} isCurrentUserTaskFollower />)
  //
  //   expect(wrapper).toMatchSnapshot()
  // })

  it('should render', () => {
    const wrapper = shallow(
      <TaskProgressEstimate taskId={'test'} isCurrentUserTaskFollower />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
