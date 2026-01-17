export interface PasswordServiceInterface {
  getHash(password: string) : Promise<string>;
  passwordMatches(password: string, hash: string): Promise<boolean>;
}
