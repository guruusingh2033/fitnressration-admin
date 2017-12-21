import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { AdminComponent } from '../../../AdminComponent';
_ = lodash;

class AnomalyTriggerFormCtrl extends AdminComponent {
	constructor($scope, $meteor, $reactive, $timeout) {
    super($scope, $meteor, $reactive, {
      uses: ['mealPlans', 'portions', 'meals', 'addOns']
    });
	}
  delete() {
    this.onDelete({anomalyTrigger:this.anomalyTrigger});
  }
	save() {
		this.onSave({anomalyTrigger:this.anomalyTrigger});
	}
}

export default angular.module('anomaly-trigger-form', [
  angularMeteor
])
  .filter('mealNames', function() {
    return (meals) => {
      return _.transform(meals, (mealNames, meal) => {
        if (!_.includes(mealNames, meal.name)) {
          mealNames.push(meal.name);
        }
      });
    }
  })
  .component('anomalytriggerform', {
    templateUrl: template,
    controller: AnomalyTriggerFormCtrl,
    bindings: {
    	anomalyTrigger: '=',
      onSave: '&',
      onDelete: '&',
      showDelete: '<',
      addButton: '<'
    }
  });
