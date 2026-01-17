class AuthResult {
  constructor(userId) {
    if (userId) {
      this.isAuthenticated = true
      this.userId = userId
    }
  }

  public isAuthenticated: boolean;
  public userId: string;
}

export default AuthResult