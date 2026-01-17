import Component from "./component";

import EnhanceForgottenPasswordForm from "./enhancers/EnhanceForgottenPasswordForm";
import EnhanceWithRouter from "enhancers/EnhanceWithRouter";

export default EnhanceWithRouter()(EnhanceForgottenPasswordForm(Component));
