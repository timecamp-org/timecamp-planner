import WorkspaceInvitationsPage from './WorkspaceInvitationsPage';

import RedirectToSignInPageIfCurrentUserIsDeauthenticated from 'enhancers/auth/RedirectToSignInPageIfCurrentUserIsDeauthenticated';

export default RedirectToSignInPageIfCurrentUserIsDeauthenticated(
  WorkspaceInvitationsPage
);
