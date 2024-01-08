import { EventEmitter, Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Ingredient } from '../shared/ingredient.model';

@Injectable()
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [];

  constructor(private shoppingListService: ShoppingListService) {
    this.recipes = [
      {
        id: 1,
        name: 'Schnitzel',
        description: 'Ein leckeres Schnitzel',
        imagePath:
          'https://osnabrueck.wochenmarkt24.de/media/image/c6/87/6f/kloetzer_3912_600x600@2x.jpg',
        ingredients: [
          { name: 'Schnitzel', amount: 1 },
          { name: 'Paniermehl', amount: 1 },
          { name: 'Ei', amount: 1 },
        ],
      },
      {
        id: 2,
        name: 'Chili sin carne',
        description: 'Leckeres Chili ganz ohne Fleisch',
        imagePath:
          'https://img.ccnull.de/1030000/preview/1034728_a22b33c65f221a380e6550070a36e0ec.jpg',
        ingredients: [
          { name: 'Bohnen', amount: 1 },
          { name: 'Mais', amount: 1 },
          { name: 'Tomaten', amount: 1 },
        ],
      },
    ];
  }

  getRecipes() {
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  getRecipe(id: number): Recipe {
    return this.recipes.filter((recipe) => recipe.id === id)[0];
  }
}
