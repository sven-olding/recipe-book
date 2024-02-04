import { NgModule } from '@angular/core';
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { ShoppingListRoutingModule } from './shopping-list-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ShoppingListComponent, ShoppingEditComponent],
  imports: [
    ShoppingListRoutingModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class ShoppingListModule {}
