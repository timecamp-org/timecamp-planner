import Component from "./component";

import EnhanceSubscriptionDescription from "./enhancers/EnhanceSubscriptionDescription";
import EnhanceWithRouter from "enhancers/EnhanceWithRouter";

export default EnhanceWithRouter()(EnhanceSubscriptionDescription(Component));
