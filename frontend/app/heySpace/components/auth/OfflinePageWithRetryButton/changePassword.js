import Component from "./component";

import EnhanceChangePasswordOfflinePage from "./enhancers/EnhanceChangePasswordOfflinePage";
import EnhanceWithRouter from "enhancers/EnhanceWithRouter";

export default EnhanceWithRouter()(EnhanceChangePasswordOfflinePage(Component));
