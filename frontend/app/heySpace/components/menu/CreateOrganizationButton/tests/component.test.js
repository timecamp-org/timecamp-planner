import React from 'react';
import { shallow } from 'enzyme';
import { doNothing } from 'common/utils';

import CreateOrganizationButton from '../component';

describe('<CreateOrganizationButton />', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<CreateOrganizationButton />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should pass onCreateOrganization prop', () => {
    const onCreateOrganization = doNothing;
    const wrapper = shallow(<CreateOrganizationButton onCreateOrganization={doNothing} />);
    expect(wrapper.prop('onClick')).toEqual(doNothing);
  });
});
