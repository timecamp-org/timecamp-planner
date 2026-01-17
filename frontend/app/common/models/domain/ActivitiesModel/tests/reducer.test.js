import ActivitiesModelReducer from '../reducer'

describe('models/domain/ActivitiesModel/reducer', () => {

  it('initialState', () => {
    expect(ActivitiesModelReducer(undefined, {})).toMatchSnapshot()
  })
})
