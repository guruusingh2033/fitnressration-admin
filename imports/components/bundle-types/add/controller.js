import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import form from '../form/controller';
import { AdminComponent } from '../../../AdminComponent';
import { BundleTypes } from '../../../api/bundleTypes';
import { resolve } from '../helpers';
_ = lodash;

class AddBundleTypeCtrl extends AdminComponent {
	constructor($scope, $meteor, $reactive, $timeout) {
    super($scope, $meteor, $reactive);
    this.$timeout = $timeout;
	}
	save(bundleType) {
    var bundleTypeId = BundleTypes.insert(resolve(bundleType));
    FlowRouter.go('editBundleType', { bundleTypeId: bundleTypeId._str });
	}
}

export default angular.module('add-bundle-type', [
  angularMeteor,
  form.name
])
  .component('addbundletype', {
    templateUrl: template,
    controller: AddBundleTypeCtrl
  });
