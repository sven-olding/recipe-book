import { Component } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css',
})
export class RecipeListComponent {
  recipes: Recipe[] = [
    {
      name: 'Schnitzel',
      description: 'Ein leckeres Schnitzel',
      imagePath:
        'https://osnabrueck.wochenmarkt24.de/media/image/c6/87/6f/kloetzer_3912_600x600@2x.jpg',
    },
    {
      name: 'Chili sin carne',
      description: 'Leckeres Chili ganz ohne Fleisch',
      imagePath:
        'https://img.ccnull.de/1030000/preview/1034728_a22b33c65f221a380e6550070a36e0ec.jpg',
    },
  ];
}
