import Component from "./component";
import EnhanceArchiveProjectController from "./enhancers/EnhanceArchiveProjectController";
import EnhanceWithRouter from "enhancers/EnhanceWithRouter";

export default EnhanceWithRouter()(EnhanceArchiveProjectController(Component));
