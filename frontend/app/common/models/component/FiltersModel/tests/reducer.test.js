/* eslint-disable import/no-unresolved */
import { Filter } from 'models/component/FiltersModel/models';
import reducer from 'models/component/FiltersModel/reducer';

import makeActionResult from '../../../../utils/makeActionResult';
import * as constants from '../constants/index';

describe('FiltersModelReducer', () => {
  const filterId = 'filter::001';
  const filter = new Filter();

  it('initialState', () => {
    expect(reducer(undefined, {})).toMatchSnapshot();
  });

  it('onSetFilterBySuccess', () => {
    const actionResult = makeActionResult({
      isOk: true,
      code: 'onSetFilterBySuccess',
      data: { filterId, filter },
    });
    const state = reducer(undefined, {
      type: constants.onSetFilterBySuccess,
      payload: { actionResult },
    });

    expect(state).toMatchSnapshot();
  });

  it('onSetGroupBySuccess', () => {
    const actionResult = makeActionResult({
      isOk: true,
      code: 'onSetGroupBySuccess',
      data: { filterId, filter },
    });
    const state = reducer(undefined, {
      type: constants.onSetGroupBySuccess,
      payload: { actionResult },
    });

    expect(state).toMatchSnapshot();
  });

  it('onClearFiltersSuccess', () => {
    const actionResult = makeActionResult({
      isOk: true,
      code: 'onClearFiltersSuccess',
      data: { filterId, filter },
    });
    const state = reducer(undefined, {
      type: constants.onClearFiltersSuccess,
      payload: { actionResult },
    });

    expect(state).toMatchSnapshot();
  });
});
