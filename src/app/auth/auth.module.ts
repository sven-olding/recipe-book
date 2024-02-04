import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AuthComponent],
  imports: [FormsModule, SharedModule, AuthRoutingModule, ReactiveFormsModule],
  exports: [AuthComponent, AuthRoutingModule],
})
export class AuthModule {}
