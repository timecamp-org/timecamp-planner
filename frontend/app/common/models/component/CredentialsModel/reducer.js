import { fromJS } from 'immutable'
import * as constants from './constants'
import * as CurrentUserContants from '../../domain/CurrentUserModel/constants'

const initialState = fromJS({
  email: '',
  password: '',
  fullName: '',
  phone: '',
  isAcceptingTerms: false,
})

function searchReducer(state = initialState, action) {
  switch (action.type) {
    case constants.onEmailChange: {
      const { email } = action
      return state.set('email', email)
    }
    case constants.onPasswordChange: {
      const { password } = action
      return state.set('password', password)
    }
    case constants.onFullNameChange: {
      const { fullName } = action
      return state.set('fullName', fullName)
    }
    case constants.onPhoneChange: {
      const { phone } = action
      return state.set('phone', phone)
    }
    case constants.onSetIsAcceptingTerms: {
      const { isAcceptingTerms } = action
      return state.set('isAcceptingTerms', isAcceptingTerms)
    }
    case CurrentUserContants.onSignInSuccess:
    case CurrentUserContants.onSignInWithGoogleAccountSuccess:
    case CurrentUserContants.onSignInWithAppleAccountSuccess:
    case CurrentUserContants.onSignUpSuccess: {
      return state
        .set('email', '')
        .set('password', '')
        .set('isAcceptingTerms', false)
    }
    default:
      return state
  }
}

export default searchReducer
