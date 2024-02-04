import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoading = false;
  isLoginMode = true;
  signupForm: FormGroup;
  private authSubscription: Subscription;

  constructor(private authService: AuthService, 
    private router: Router, 
    private componentFactoryResolver: ComponentFactoryResolver) {}
    @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onHandleError() {
  }

  private showErrorAlert(message: string) {
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(alertComponentFactory);
    componentRef.instance.message = message;
    this.authSubscription = componentRef.instance.close.subscribe(() => {
      this.authSubscription.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  onSubmit() {
    if (!this.signupForm.valid) {
      return;
    }
    const { email, password } = this.signupForm.value;
    let authObservable: Observable<AuthResponseData>;
    this.isLoading = true;
    if (this.isLoginMode) {
      authObservable = this.authService.login(email, password);
    } else {
      authObservable = this.authService.signup(email, password);
    }
    this.authSubscription = authObservable.subscribe(
      (response) => {
        console.log(response);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      (errorResponse) => {
        console.error(errorResponse);
        this.isLoading = false;
        this.showErrorAlert(errorResponse);
      }
    );
  }
}
