import Component from "./component";

import EnhanceChangePasswordForm from "./enhancers/EnhanceChangePasswordForm";
import EnhanceWithRouter from "enhancers/EnhanceWithRouter";

export default EnhanceWithRouter()(EnhanceChangePasswordForm(Component));
