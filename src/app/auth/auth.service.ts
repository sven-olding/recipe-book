import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from './user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_KEY = environment.firebaseAPIKey;
  user = new BehaviorSubject<User>(null);
  tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

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
        }),
        tap((responseData: AuthResponseData) => {
          this.handleAuthentication(responseData);
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
        }),
        tap((responseData: AuthResponseData) => {
          this.handleAuthentication(responseData);
        })
      );
  }

  private handleAuthentication(authData: AuthResponseData) {
    const expirationDate = new Date(
      new Date().getTime() + +authData.expiresIn * 1000
    );
    const user = new User(
      authData.email,
      authData.localId,
      authData.idToken,
      expirationDate
    );
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
    this.autoLogout(+authData.expiresIn * 1000);
  }

  autoLogin() {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      return;
    }
    const user: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(userData);
    const loadedUser = new User( user.email, user.id, user._token, new Date(user._tokenExpirationDate));
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration = new Date(user._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
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

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }
}
