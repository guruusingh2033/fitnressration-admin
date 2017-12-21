import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { AdminComponent } from '../../../AdminComponent';
_ = lodash;

class BundleTypeFormCtrl extends AdminComponent {
	constructor($scope, $meteor, $reactive) {
    super($scope, $meteor, $reactive);
    this.uses('mealPlans', 'portions');
	}
	save() {
		this.onSave({bundleType:this.bundleType});
	}
}

export default angular.module('bundle-type-form', [
  angularMeteor
])
  .component('bundletypeform', {
    templateUrl: template,
    controller: BundleTypeFormCtrl,
    bindings: {
    	bundleType: '<',
      onSave: '&',
    }
  });
