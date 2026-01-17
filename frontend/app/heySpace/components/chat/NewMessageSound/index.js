import Component from "./component";

import EnhanceNewMessageSound from "./enhancers/EnhanceNewMessageSound";
import EnhanceWithRouter from "enhancers/EnhanceWithRouter";

export default EnhanceWithRouter()(EnhanceNewMessageSound(Component));
