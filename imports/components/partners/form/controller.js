import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { AdminComponent } from '../../../AdminComponent';
_ = lodash;

class PartnerFormCtrl extends AdminComponent {
	constructor($scope, $meteor, $reactive) {
    super($scope, $meteor, $reactive);
	}

	save() {
		this.onSave({partner:this.partner});
	}
}

export default angular.module('partner-form', [
  angularMeteor
])
  .component('partnerform', {
    templateUrl: template,
    controller: PartnerFormCtrl,
    bindings: {
    	partner: '<',
      onSave: '&',
    }
  });
