import Component from "./component";

import EnhanceCardDetailsModal from "./enhancer/EnhanceCardDetailsModal";
import EnhanceWithFileUpload from 'enhancers/EnhanceWithFileUpload';
import EnhanceWithRouter from "enhancers/EnhanceWithRouter";

export default EnhanceWithRouter(
  null,
  false
)(EnhanceCardDetailsModal(EnhanceWithFileUpload(Component)));
