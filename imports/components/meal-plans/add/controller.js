import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import form from '../form/controller';
import { MealPlans } from '../../../api/mealPlans';
import { AdminComponent } from '../../../AdminComponent';
import { resolve } from '../helpers';
_ = lodash;

class AddMealPlanCtrl extends AdminComponent {
	constructor($scope, $meteor, $reactive, $timeout) {
    super($scope, $meteor, $reactive);
    this.$timeout = $timeout;
	}
	save(mealPlan) {
    var mealPlanId = MealPlans.insert(resolve(mealPlan));
    FlowRouter.go('editMealPlan', { mealPlanId: mealPlanId._str });
	}
}

export default angular.module('add-meal-plan', [
  angularMeteor,
  form.name
])
  .component('addmealplan', {
    templateUrl: template,
    controller: AddMealPlanCtrl
  });
