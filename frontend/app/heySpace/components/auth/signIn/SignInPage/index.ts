import Component from './SignInPage';

import RedirectToDefaultPageIfCurrentUserIsAuthenticated from 'enhancers/auth/RedirectToDefaultPageIfCurrentUserIsAuthenticated';

export default RedirectToDefaultPageIfCurrentUserIsAuthenticated(Component);
