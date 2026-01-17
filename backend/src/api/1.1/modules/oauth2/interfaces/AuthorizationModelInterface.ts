import { BaseModel, AuthorizationCodeModel, RequestAuthenticationModel } from "oauth2-server";

export interface AuthorizationModelInterface extends BaseModel, AuthorizationCodeModel, RequestAuthenticationModel {

}
