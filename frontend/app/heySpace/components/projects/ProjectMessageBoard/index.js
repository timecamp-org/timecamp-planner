import component from "./component";

import EnhanceProjectMessageBoard from "./enhancers/EnhanceProjectMessageBoard";
import EnhanceWithRouter from "enhancers/EnhanceWithRouter";

export default EnhanceWithRouter(["projectId"])(
  EnhanceProjectMessageBoard(component)
);
