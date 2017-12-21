import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import form from '../form/controller';
import { AdminComponent } from '../../../AdminComponent';
import { resolve } from '../helpers';
_ = lodash;

[ AddOns ] = AdminComponent.collections('AddOns');

class AddAddOnCtrl extends AdminComponent {
	constructor($scope, $meteor, $reactive, $timeout) {
    super($scope, $meteor, $reactive);
    this.$timeout = $timeout;
    this.newAddOn = {
      images: [],
      variants: []
    };
	}
	save(addOn) {
    var addOnId = AddOns.insert(resolve(addOn));
    FlowRouter.go('editAddOn', { addOnId: addOnId._str });
	}
}

export default angular.module('add-add-on', [
  angularMeteor,
  form.name
])
  .component('addaddon', {
    templateUrl: template,
    controller: AddAddOnCtrl
  });
