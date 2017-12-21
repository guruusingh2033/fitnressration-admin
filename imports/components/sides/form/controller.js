import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { AdminComponent } from '../../../AdminComponent';
_ = lodash;

class SideFormCtrl extends AdminComponent {
	constructor($scope, $meteor, $reactive) {
    super($scope, $meteor, $reactive);
	}

	save() {
		this.onSave({side:this.side});
	}
}

export default angular.module('side-form', [
  angularMeteor
])
  .component('sideform', {
    templateUrl: template,
    controller: SideFormCtrl,
    bindings: {
    	side: '<',
      onSave: '&',
    }
  });
