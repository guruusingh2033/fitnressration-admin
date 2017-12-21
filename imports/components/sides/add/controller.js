import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import form from '../form/controller';
import { Sides } from '../../../api/sides';
import { AdminComponent } from '../../../AdminComponent';
_ = lodash;

function resolve(side) {
	return {
		name: side.name
	};
}

class AddSideCtrl extends AdminComponent {
	constructor($scope, $meteor, $reactive, $timeout) {
    super($scope, $meteor, $reactive);
    this.$timeout = $timeout;
	}
	save(side) {
    var sideId = Sides.insert(resolve(side));
    FlowRouter.go('editSide', { sideId: sideId._str });
	}
}

export default angular.module('add-side', [
  angularMeteor,
  form.name
])
  .component('addside', {
    templateUrl: template,
    controller: AddSideCtrl
  });
