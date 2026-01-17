import component from "./component";
import EnhanceDateCellWrapper from "./enhancers/EnhanceDateCellWrapper";
import EnhanceWithRouter from "enhancers/EnhanceWithRouter";

export default EnhanceWithRouter()(EnhanceDateCellWrapper(component));
