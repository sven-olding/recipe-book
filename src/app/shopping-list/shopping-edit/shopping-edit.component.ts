import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrl: './shopping-edit.component.css',
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('form') form: FormGroup;

  private editSubscription: Subscription;
  editMode = false;
  private editedItemIndex: number;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit() {
    this.editSubscription = this.shoppingListService.startedEditing.subscribe(
      (index) => {
        this.editMode = true;
        this.editedItemIndex = index;
        const ingredient = this.shoppingListService.getIngredient(index);
        this.form.setValue({
          name: ingredient.name,
          amount: ingredient.amount,
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.editSubscription.unsubscribe();
  }

  onAddItem() {
    const ingName = this.form.value.name;
    const ingAmount = this.form.value.amount;

    if (this.editMode) {
      this.shoppingListService.updateIngredient(
        this.editedItemIndex,
        new Ingredient(ingName, ingAmount)
      );
    } else {
      const newIngredient = new Ingredient(ingName, ingAmount);
      this.shoppingListService.addIngredient(newIngredient);
    }
  }

  onClear() {
    this.form.reset();
    this.editMode = false;
  }

  onDeleteItem() {
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.form.reset();
    this.editMode = false;
  }
}
