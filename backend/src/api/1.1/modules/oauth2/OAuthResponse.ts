import { OAuthResponseInterface } from "./interfaces/OAuthResponseInterface";

export class OAuthResponse implements OAuthResponseInterface
{
  public access_token: string;
  public expires_in: number;
  public refresh_token: string;
  public token_type: string;

  constructor(access_token: string, refresh_token: string, expires_in: number, token_type: string) {
    this.access_token = access_token;
    this.refresh_token = refresh_token;
    this.expires_in = expires_in;
    this.token_type = token_type;
  }
}
