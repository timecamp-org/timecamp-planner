import { createStackNavigator } from 'react-navigation-stack'
import RouteName from './routeNames'

import SignInPage from '../credentials/SignInPage'
import SignUpPage from '../credentials/SignUpPage'
import ForgottenPasswordPage from '../credentials/ForgottenPasswordPage'
import ForgotPasswordSuccessPage from '../credentials/ForgotPasswordSuccessPage'
import CreateWorkspacePage from '../workspace/CreateWorkspacePage'
import GoogleSignUpForm from '../credentials/GoogleSignUpForm'
import { whiteTwoColor } from '../../../common/commonStyles/colors'

const AuthFlowStack = createStackNavigator({
  [RouteName.SIGN_IN]: SignInPage,
  [RouteName.SIGN_UP]: SignUpPage,
  [RouteName.FORGOT_PASSWORD]: ForgottenPasswordPage,
  [RouteName.FORGOT_PASSWORD_COMPLETED]: ForgotPasswordSuccessPage,
  [RouteName.CREATE_NEW_WORKSPACE]: CreateWorkspacePage,
  [RouteName.GOOGLE_SIGN_UP]: GoogleSignUpForm,
}, {
  initialRouteName: RouteName.SIGN_IN,
  headerMode: 'none',
  navigationOptions: {
    animationEnabled: false,
    cardStyle: {
      backgroundColor: whiteTwoColor,
    }
  }
})

export default AuthFlowStack
