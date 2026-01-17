import Component from './GoogleSignUpPage';

import RedirectToDefaultPageIfCurrentUserIsAuthenticated from 'enhancers/auth/RedirectToDefaultPageIfCurrentUserIsAuthenticated';
import EnhanceGoogleSignUpPage from './enhancers/EnhanceGoogleSignUpPage';

export default RedirectToDefaultPageIfCurrentUserIsAuthenticated(
  EnhanceGoogleSignUpPage(Component)
);
