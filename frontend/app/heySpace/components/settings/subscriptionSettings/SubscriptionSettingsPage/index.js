import Component from "./component";

import RedirectToSignInPageIfCurrentUserIsDeauthenticated from 'enhancers/auth/RedirectToSignInPageIfCurrentUserIsDeauthenticated';
import EhanceWithUserTrackerEvent from 'enhancers/EhanceWithUserTrackerEvent';
import { UserTrackerEvent } from "models/component/UserTrackerEventModel/constants";
import EnhanceSubscriptionSettingsPage from "./enhancers/EnhanceSubscriptionSettingsPage";
import EnhanceWithRouter from "enhancers/EnhanceWithRouter";

export default EhanceWithUserTrackerEvent(UserTrackerEvent.pageOpen, {
  type: "workspace-settings",
})(
  RedirectToSignInPageIfCurrentUserIsDeauthenticated(
    EnhanceWithRouter()(EnhanceSubscriptionSettingsPage(Component))
  )
);
