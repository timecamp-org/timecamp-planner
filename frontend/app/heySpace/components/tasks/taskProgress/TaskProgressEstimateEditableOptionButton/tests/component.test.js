import React from 'react';
import { shallow } from 'enzyme';
import TaskProgressEstimateEditableOptionButton from '../TaskProgressEstimateEditableOptionButton/component';

describe('<TaskProgressEstimateEditableOptionButton />', () => {
  let wrapper;

  it('should render', () => {
    wrapper = shallow(
      <TaskProgressEstimateEditableOptionButton optionThreshold={50} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  describe('mouse events', () => {
    const optionThresholdProp = 75;
    const onClickMock = jest.fn();
    const onMouseEnterMock = jest.fn();
    const onMouseLeaveMock = jest.fn();
    const eventObjectMock = {};

    beforeAll(() => {
      wrapper = shallow(
        <TaskProgressEstimateEditableOptionButton
          optionThreshold={optionThresholdProp}
          onMouseEnter={onMouseEnterMock}
          onMouseLeave={onMouseLeaveMock}
          onClick={onClickMock}
        />
      );
    });

    it('onClick', () => {
      wrapper.simulate('click', eventObjectMock);
      expect(onClickMock).toHaveBeenCalledWith(
        eventObjectMock,
        optionThresholdProp
      );
    });

    it('onMouseEnter', () => {
      wrapper.simulate('mouseEnter');
      expect(onMouseEnterMock).toHaveBeenCalledWith(optionThresholdProp);
    });

    it('onMouseLeave', () => {
      wrapper.simulate('mouseLeave', eventObjectMock);
      expect(onMouseLeaveMock).toHaveBeenCalledWith(
        eventObjectMock,
        optionThresholdProp
      );
    });
  });
});
