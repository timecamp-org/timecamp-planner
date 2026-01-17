import Component from './SignUpPage';

import RedirectToDefaultPageIfCurrentUserIsAuthenticated from 'enhancers/auth/RedirectToDefaultPageIfCurrentUserIsAuthenticated';

export default RedirectToDefaultPageIfCurrentUserIsAuthenticated(Component);
