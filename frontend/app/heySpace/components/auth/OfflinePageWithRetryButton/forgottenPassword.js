import Component from "./component";

import EnhanceForgottenPasswordOfflinePage from "./enhancers/EnhanceForgottenPasswordOfflinePage";
import EnhanceWithRouter from "enhancers/EnhanceWithRouter";

export default EnhanceWithRouter()(
  EnhanceForgottenPasswordOfflinePage(Component)
);
