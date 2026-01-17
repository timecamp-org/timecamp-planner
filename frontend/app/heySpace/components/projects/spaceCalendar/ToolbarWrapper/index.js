import component from "./component";
import EnhanceToolbarWrapper from "./enhancers/EnhanceToolbarWrapper";
import EnhanceWithRouter from "enhancers/EnhanceWithRouter";

export default EnhanceWithRouter()(EnhanceToolbarWrapper(component));
