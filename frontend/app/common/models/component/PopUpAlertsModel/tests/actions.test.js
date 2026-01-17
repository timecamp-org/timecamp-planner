import * as actions from '../actions'

describe('models/component/PopUpAlertsModel/actions', () => {
  const actionResult = { test: 'test' }

  it('onRemoveAlert', () => {
    expect(actions.onRemoveAlert('alert::1')).toMatchSnapshot()
  })

  it('onAddAlert', () => {
    expect(actions.onRemoveAlert(actionResult)).toMatchSnapshot()
  })
})
