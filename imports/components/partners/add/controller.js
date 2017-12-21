import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import form from '../form/controller';
import { Partners } from '../../../api/partners';
import { AdminComponent } from '../../../AdminComponent';
import { resolve } from '../helpers';
_ = lodash;

class AddPartnerCtrl extends AdminComponent {
	constructor($scope, $meteor, $reactive, $timeout) {
    super($scope, $meteor, $reactive);
    this.$timeout = $timeout;
	}
	save(partners) {
    var partnerId = Partners.insert(resolve(partners));
    FlowRouter.go('editPartner', { partnerId: partnerId._str });
	}
}

export default angular.module('add-partner', [
  angularMeteor,
  form.name
])
  .component('addpartner', {
    templateUrl: template,
    controller: AddPartnerCtrl
  });
