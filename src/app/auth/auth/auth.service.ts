import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
          this.API_KEY,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError((errorResponse) => {
          const errorMessage = this.getErrorMessage(errorResponse);
          return throwError(errorMessage);
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
          this.API_KEY,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError((errorResponse) => {
          const errorMessage = this.getErrorMessage(errorResponse);
          return throwError(errorMessage);
        })
      );
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    const defaultErorrMessage = 'An error occurred!';
    if (!error.error || !error.error.error) {
      return defaultErorrMessage;
    }
    switch (error.error.error.message) {
      case 'EMAIL_EXISTS':
        return 'This email exists already';
      case 'EMAIL_NOT_FOUND':
        return 'This email does not exist';
      case 'INVALID_PASSWORD':
        return 'This password is not correct';
      case 'INVALID_LOGIN_CREDENTIALS':
        return 'Invalid login credentials';
      default:
        return defaultErorrMessage;
    }
  }
}
