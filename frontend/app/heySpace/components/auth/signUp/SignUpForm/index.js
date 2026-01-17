import Component from "./component";

import EnhanceSignUpForm from "./enhancers/EnhanceSignUpForm";
import EnhanceWithRouter from "enhancers/EnhanceWithRouter";

export default EnhanceWithRouter()(EnhanceSignUpForm(Component));
