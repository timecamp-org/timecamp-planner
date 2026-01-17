import Component from './ForgottenPasswordPage';

import RedirectToDefaultPageIfCurrentUserIsAuthenticated from 'enhancers/auth/RedirectToDefaultPageIfCurrentUserIsAuthenticated';

export default RedirectToDefaultPageIfCurrentUserIsAuthenticated(Component);
