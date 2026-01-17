import Component from "./component";

import EnhanceMyTaskList from "./enhancers/EnhanceMyTaskList";
import EnhanceWithRouter from "enhancers/EnhanceWithRouter";

export default EnhanceWithRouter()(EnhanceMyTaskList(Component));
