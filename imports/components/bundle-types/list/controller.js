import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { ListAdminComponent } from '../../../ListAdminComponent';
import { BundleTypes } from '../../../api/bundleTypes';
import { MealPlans } from '../../../api/mealPlans';
import { Portions } from '../../../api/portions';
_ = lodash;

class BundleTypesCtrl extends ListAdminComponent {
	constructor($scope, $meteor, $reactive) {
    super($scope, $meteor, $reactive);
    this.subscribe('bundleTypes', 'mealPlans', 'portions');
    this.helpers({
      bundleTypes() {
        return BundleTypes.find();
      }
    });
	}
  get collection() { return BundleTypes; }
  get documents() { return this.bundleTypes; }
  
  mealPlan(id) {
    return MealPlans.findOne({_id:id});
  }
  portion(id) {
    return Portions.findOne({_id:id});
  }
}

export default angular.module('bundle-types', [
  angularMeteor
])
  .component('bundletypes', {
    templateUrl: template,
    controller: BundleTypesCtrl
  });
