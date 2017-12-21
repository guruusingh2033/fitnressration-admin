import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { ListAdminComponent } from '../../../ListAdminComponent';
import { AdminComponent } from '../../../AdminComponent';

[ MealPlans, Portions, Ingredients ] = AdminComponent.collections('MealPlans', 'Portions', 'Ingredients');

_ = lodash;

class MealsCtrl extends ListAdminComponent {
	constructor($scope, $meteor, $reactive) {
    super($scope, $meteor, $reactive, {
      subscriptions: ['meals', 'ingredients', 'mealPlans', 'portions'],
      helpers: {
        meals() {

          var filter = this.getReactively('filter');
          var query = {};
          if (filter) {
            var mealPlans = MealPlans.find({name:new RegExp(filter, 'i')}).fetch().map(mealPlan => mealPlan._id);
            var portions = Portions.find({name:new RegExp(filter, 'i')}).fetch().map(portion => portion._id);
            var ingredients = Ingredients.find({name:new RegExp(filter, 'i')}).fetch().map(ingredient => ingredient._id);
            query.$or = [{name:new RegExp(filter, 'i')}, {sku:new RegExp(filter, 'i')}, {grade:new RegExp(filter, 'i')}, {mealPlan:{$in:mealPlans}}, {portion:{$in:portions}}, {mainIngredient:{$in:ingredients}}, {allergens:{$elemMatch:{$in:ingredients}}}];
          }
          return Meals.find(query);

          // var filter = this.getReactively('filter');
          // var query = {};
          // if (filter) {
          //   query['name'] = new RegExp(filter, 'i');
          // }
          // return Meals.find(query);
        }
      }
    });
	}

  get collection() { return Meals; }
  get documents() { return this.meals; }
}

export default angular.module('meals', [
  angularMeteor
])
  .component('meals', {
    templateUrl: template,
    controller: MealsCtrl
  });
