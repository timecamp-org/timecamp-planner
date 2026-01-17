import getDefaultAppUrl from './getDefaultAppUrl'
import { fromJS } from 'immutable'
import { FIRST_PROJECT_NAME } from '../../../common/models/domain/ProjectsModel/constants'

describe('utils/getDefaultAppUrl', () => {
  it('without data', () => {
    const url = getDefaultAppUrl()
    expect(url).toEqual(`/projects/${FIRST_PROJECT_NAME}`)
  })

  it('with user', () => {
    let data = {
      user: fromJS({
        firstName: 'firstName',
        lastName: 'lastName',
      }),
    }
    let url = getDefaultAppUrl(data)
    expect(url).toEqual(`/projects/${FIRST_PROJECT_NAME}`)

    data = {
      user: fromJS({
        firstName: '',
        lastName: '',
      }),
    }
    url = getDefaultAppUrl(data)
    expect(url).toEqual(`/projects/${FIRST_PROJECT_NAME}`)
  })
})
