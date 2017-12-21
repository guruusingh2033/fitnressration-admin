import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { AdminComponent } from '../../../AdminComponent';
import form from '../form/controller';
import { resolve } from '../helpers';
_ = lodash;

[ Meals ] = AdminComponent.collections('Meals');

class AddMealCtrl extends AdminComponent  {
	constructor($scope, $meteor, $reactive) {
    super($scope, $meteor, $reactive);
    this.newMeal = {
      allergens: [],
      sides: []
    };
	}
  save(meal) {
    var id = Meals.insert(resolve(meal));
    FlowRouter.go(`/products/meals/${id}/edit`);
  }
}

export default angular.module('add-meal', [
  angularMeteor,
  form.name
])
  .component('addmeal', {
    templateUrl: template,
    controller: AddMealCtrl
  });
