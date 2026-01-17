import { JsonWebToken } from "../../token/JsonWebToken";
import { TokenType } from "../../token/types";
import { ValidatedSubjectResult } from "../types";

/*
 * Interface
 */
export interface OpenIdProviderInterface {
  getValidatedSubject<T extends TokenType>(jwt: JsonWebToken<T>): Promise<ValidatedSubjectResult>;
}
