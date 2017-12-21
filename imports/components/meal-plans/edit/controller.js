import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import form from '../form/controller';
import { MealPlans } from '../../../api/mealPlans';
import { AdminComponent } from '../../../AdminComponent';
import { resolve } from '../helpers';
_ = lodash;


class EditMealPlanCtrl extends AdminComponent {
	constructor($scope, $meteor, $reactive, $timeout) {
    super($scope, $meteor, $reactive);
    this.subscribe('mealPlans');
    this.helpers({
    	mealPlan() {
    		return _.cloneDeep(MealPlans.findOne({_id:new Mongo.ObjectID(this.mealplanid)}));
    	}
    });
    this.$timeout = $timeout;
	}
	save(mealPlan) {
		MealPlans.update({_id:new Mongo.ObjectID(this.mealplanid)}, {$set:resolve(mealPlan)});
    this.saved = true;
    this.$timeout(() => {
      this.saved = false;
    }, 5000);
	}
}

export default angular.module('edit-meal-plan', [
  angularMeteor,
  form.name
])
  .component('editmealplan', {
    templateUrl: template,
    controller: EditMealPlanCtrl,
    bindings: {
    	mealplanid: '<'
    }
  });
