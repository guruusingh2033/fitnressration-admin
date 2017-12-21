import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { ListAdminComponent } from '../../../ListAdminComponent';
import { Sides } from '../../../api/sides';
_ = lodash;

class SidesCtrl extends ListAdminComponent {
	constructor($scope, $meteor, $reactive) {
    super($scope, $meteor, $reactive);
    this.subscribe('sides');
    this.helpers({
      sides() {
        return Sides.find();
      }
    });
	}

  get collection() { return Sides; }
  get documents() { return this.sides; }
}

export default angular.module('sides', [
  angularMeteor
])
  .component('sides', {
    templateUrl: template,
    controller: SidesCtrl
  });
