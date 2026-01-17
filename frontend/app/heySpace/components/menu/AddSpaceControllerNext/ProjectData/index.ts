import Component from "./component";

import EnhanceAddSpaceController from "./enhancers/EnhanceAddSpaceController";
import EnhanceWithRouter from "enhancers/EnhanceWithRouter";

export default EnhanceWithRouter()(EnhanceAddSpaceController(Component));
