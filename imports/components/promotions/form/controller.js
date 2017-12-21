import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { AdminComponent } from '../../../AdminComponent';

class PromotionFormCtrl extends AdminComponent {
  constructor($scope, $meteor, $reactive) {
    super($scope, $meteor, $reactive);
    this.uses('portions', 'mealPlans', 'bundleTypes');
  }
  save() {
    this.onSave({promotion:this.promotion});
  }
}

export default angular.module('promotion-form', [
  angularMeteor,
])
  .filter('bundleTypes2', function() {
    return function(bundleTypes, bundle) {
      if (bundle && bundle.portion && bundle.mealPlan) {
        return _.filter(bundleTypes, function(bundleType) {
          return bundleType.portion._str == bundle.portion._str && bundleType.mealPlan._str == bundle.mealPlan._str;
        });        
      }
      else {
        return [];
      }
    }
  })
  .component('promotionform', {
    templateUrl: template,
    controller: PromotionFormCtrl,
    bindings: {
      onSave: '&',
      promotion: '<'
    }
  });
