import Component from "./component";

import EnhanceGoogleSignUpForm from "./enhancers/EnhanceGoogleSignUpForm";
import EnhanceWithRouter from "enhancers/EnhanceWithRouter";

export default EnhanceWithRouter()(EnhanceGoogleSignUpForm(Component));
