import * as ActivitiesModelSelectors from '../selectors'
import stateMock from 'stateMock'

describe('models/domain/ActivitiesModel/selectors', () => {

  it('selectActivitiesDomain', () => {
    const activitiesDomain = ActivitiesModelSelectors.selectActivitiesDomain(stateMock)
    expect(activitiesDomain).toMatchSnapshot()
  })
})
