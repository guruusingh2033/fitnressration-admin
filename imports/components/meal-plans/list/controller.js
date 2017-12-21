import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { ListAdminComponent } from '../../../ListAdminComponent';
_ = lodash;

class MealPlansCtrl extends ListAdminComponent {
	constructor($scope, $meteor, $reactive) {
    super($scope, $meteor, $reactive, {
      uses: ['mealPlans']
    });
	}
  get collection() { return 'MealPlans'; }
  get documents() { return this.mealPlans; }
}

export default angular.module('meal-plans', [
  angularMeteor
])
  .component('mealplans', {
    templateUrl: template,
    controller: MealPlansCtrl
  });
