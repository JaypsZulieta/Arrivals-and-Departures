import { UserDetails } from 'src/users/users.service';

export class Authentication {
  private userDetails: UserDetails;
  private accessToken: string;
  private refreshToken: string;

  constructor(userDetails: UserDetails, accessToken: string, refreshToken: string) {
    this.userDetails = userDetails;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  getUserDetails(): UserDetails {
    return this.userDetails;
  }

  getAccessToken(): string {
    return this.accessToken;
  }

  getRefreshToken(): string {
    return this.refreshToken;
  }
}

export class RefreshAuthentication {
  private accessToken: string;
  private refreshToken: string;
  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  getAccessToken(): string {
    return this.accessToken;
  }

  getRefreshToken(): string {
    return this.refreshToken;
  }
}

export class EmailAndPasswordCredentials {
  private email: string;
  private password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  getEmail(): string {
    return this.email;
  }

  getPassword(): string {
    return this.password;
  }
}
