import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { AdminComponent } from '../../../AdminComponent';
import form from '../form/controller';
import { resolve } from '../helpers';
_ = lodash;

[ Meals ] = AdminComponent.collections('Meals');

class EditMealCtrl extends AdminComponent  {
	constructor($scope, $meteor, $reactive, $timeout) {
    super($scope, $meteor, $reactive, {
      subscriptions: ['meals'],
      helpers: {
        meal() {
          return _.cloneDeep(Meals.findOne({_id:new Mongo.ObjectID(this.mealid)}));
        }
      }
    });
    this.$timeout = $timeout;
	}
  save(meal) {
    Meals.update({_id:new Mongo.ObjectID(this.mealid)}, {
      $set:resolve(meal)
    });
    this.saved = true;
    this.$timeout(() => {
      this.saved = false;
    }, 5000);
  }
}

export default angular.module('edit-meal', [
  angularMeteor,
  form.name
])
  .component('editmeal', {
    templateUrl: template,
    controller: EditMealCtrl,
    bindings: {
      mealid: '<',
    }
  });
