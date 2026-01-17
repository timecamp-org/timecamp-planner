import * as PopUpAlertsModelSelectors from '../selectors'
import stateMock from 'stateMock'
import { Map, List } from 'immutable'
import { Alert } from 'models/component/PopUpAlertsModel/models'

describe('models/component/PopUpAlertsModel/selectors', () => {
  const alert = new Alert({
    id: 'alert::1',
  })

  it('selectAlertIds', () => {
    expect(PopUpAlertsModelSelectors.selectAlertIds(stateMock)).toEqual(new List(['alert::1']))
  })

  it('selectAlert', () => {
    expect(PopUpAlertsModelSelectors.selectAlert(stateMock, { alertId: 'alert::1' })).toEqual(alert)
  })
})
