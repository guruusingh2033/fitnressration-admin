import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { ListAdminComponent } from '../../../ListAdminComponent';
import { Portions } from '../../../api/portions';
_ = lodash;

class PortionsCtrl extends ListAdminComponent {
	constructor($scope, $meteor, $reactive) {
    super($scope, $meteor, $reactive);
    this.subscribe('portions');
    this.helpers({
      portions() {
        return Portions.find();
      }
    });
	}

  get collection() { return Portions; }
  get documents() { return this.portions; }
}

export default angular.module('portions', [
  angularMeteor
])
  .component('portions', {
    templateUrl: template,
    controller: PortionsCtrl
  });
