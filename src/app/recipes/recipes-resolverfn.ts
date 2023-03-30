import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Recipe } from './recipe.model';
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipe.actions';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { map, of, switchMap, take } from 'rxjs';

export const recipeResolverFn: ResolveFn<{ recipes: Recipe[] }> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const store = inject(Store<fromApp.AppState>);
  const actions$ = inject(Actions);

  return store.select('recipes').pipe(
    map((recipesState) => {
      return recipesState.recipes;
    }),
    switchMap((recipes) => {
      if (recipes.length === 0) {
        store.dispatch(RecipesActions.fetchRecipes());
        return actions$.pipe(ofType(RecipesActions.setRecipes), take(1));
      } else {
        return of({ recipes: recipes });
      }
    })
  );
};
