import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css',
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[] = [];
  private recipesChangedSubscription: Subscription;

  constructor(private recipeService: RecipeService) {}

  ngOnDestroy(): void {
    this.recipesChangedSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.recipes = this.recipeService.getRecipes();
    this.recipesChangedSubscription =
      this.recipeService.recipesChanged.subscribe((recipes: Recipe[]) => {
        this.recipes = recipes;
      });
  }
}
