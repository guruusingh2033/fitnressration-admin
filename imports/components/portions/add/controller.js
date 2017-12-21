import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import form from '../form/controller';
import { Portions } from '../../../api/portions';
import { AdminComponent } from '../../../AdminComponent';
import { resolve } from '../helpers';
_ = lodash;

class PortionCtrl extends AdminComponent {
	constructor($scope, $meteor, $reactive, $timeout) {
    super($scope, $meteor, $reactive);
    this.$timeout = $timeout;
	}
	save(portion) {
    var portionId = Portions.insert(resolve(portion));
    FlowRouter.go('editPortion', { portionId: portionId._str });
	}
}

export default angular.module('add-portion', [
  angularMeteor,
  form.name
])
  .component('addportion', {
    templateUrl: template,
    controller: PortionCtrl
  });
