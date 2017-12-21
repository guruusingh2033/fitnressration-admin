import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { AdminComponent } from '../../../AdminComponent';
_ = lodash;

class PortionFormCtrl extends AdminComponent {
	constructor($scope, $meteor, $reactive) {
    super($scope, $meteor, $reactive);
	}

	save() {
		this.onSave({portion:this.portion});
	}
}

export default angular.module('portion-form', [
  angularMeteor
])
  .component('portionform', {
    templateUrl: template,
    controller: PortionFormCtrl,
    bindings: {
    	portion: '<',
      onSave: '&',
    }
  });
