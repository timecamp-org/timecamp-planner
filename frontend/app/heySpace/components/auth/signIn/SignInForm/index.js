import Component from "./component";

import EnhanceSignInForm from "./enhancers/EnhanceSignInForm";
import EnhanceWithRouter from "enhancers/EnhanceWithRouter";

export default EnhanceWithRouter()(EnhanceSignInForm(Component));
