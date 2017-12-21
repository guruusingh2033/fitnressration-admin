import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { ListAdminComponent } from '../../../ListAdminComponent';

class AddOnsCtrl extends ListAdminComponent {
	constructor($scope, $meteor, $reactive) {
    super($scope, $meteor, $reactive, {
      uses: ['addOns']
    });
	}
  get collection() { return 'AddOns'; }
  get documents() { return this.addOns; }
}

export default angular.module('add-ons', [
  angularMeteor
])
  .component('addons', {
    templateUrl: template,
    controller: AddOnsCtrl
  });
