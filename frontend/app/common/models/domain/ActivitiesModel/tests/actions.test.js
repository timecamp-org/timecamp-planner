import * as actions from '../actions'

describe('models/domain/ActivitiesModel/actions', () => {

  it('onBatchActivitiesData', () => {
    const wrappedEntities = [
      {
        id: 'activity::001',
        actorId: 'user::001',
        containerId: 'project::001',
        targetId: 'project::001',
        targetType: 'project',
        targetValue: 'myProj',
        createdAt: null,
      }
    ]

    const activityIdTargetIdMap = {
      'activity::001': 'project::001',
    }
    expect(actions.onBatchActivitiesData(wrappedEntities, activityIdTargetIdMap)).toMatchSnapshot()
  })

})
