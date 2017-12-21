import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { AdminComponent } from '../../../AdminComponent';
_ = lodash;

class MealPlanFormCtrl extends AdminComponent {
	constructor($scope, $meteor, $reactive) {
    super($scope, $meteor, $reactive);
    console.log(this.mealPlan);
	}

	save() {
		this.onSave({mealPlan:this.mealPlan});
	}
}

export default angular.module('meal-plan-form', [
  angularMeteor
])
  .component('mealplanform', {
    templateUrl: template,
    controller: MealPlanFormCtrl,
    bindings: {
    	mealPlan: '<',
      onSave: '&',
    }
  });
