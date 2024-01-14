import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_KEY = environment.firebaseAPIKey;

  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
        this.API_KEY,
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    );
  }

  login(email: string, password: string) {
    return this.http.post(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
        this.API_KEY,
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    );
  }
}
