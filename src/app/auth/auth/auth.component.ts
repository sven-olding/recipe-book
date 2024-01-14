import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit {
  isLoading = false;
  isLoginMode = true;
  signupForm: FormGroup;
  error: string = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (!this.signupForm.valid) {
      return;
    }
    const { email, password } = this.signupForm.value;
    if (this.isLoginMode) {
      this.login(email, password);
    } else {
      this.signup(email, password);
    }
  }

  private toggleLoading() {
    this.isLoading = !this.isLoading;
  }

  private login(email: string, password: string) {
    this.toggleLoading();
    this.authService.login(email, password).subscribe(
      (response) => {
        console.log(response);
        this.toggleLoading();
        this.error = null;
      },
      (errorResponse) => {
        console.error(errorResponse);
        this.toggleLoading();
        this.error = errorResponse;
      }
    );
  }

  private signup(email: string, password: string) {
    this.toggleLoading();
    this.authService.signup(email, password).subscribe(
      (response) => {
        console.log(response);
        this.toggleLoading();
        this.error = null;
      },
      (errorResponse) => {
        console.error(errorResponse);
        this.toggleLoading();
        this.error = errorResponse;
      }
    );
  }
}
