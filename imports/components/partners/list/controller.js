import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { ListAdminComponent } from '../../../ListAdminComponent';
import { Partners } from '../../../api/partners';
_ = lodash;

class PartnersCtrl extends ListAdminComponent {
	constructor($scope, $meteor, $reactive) {
    super($scope, $meteor, $reactive);
    this.subscribe('partners');
    this.helpers({
      partners() {
        return Partners.find();
      }
    });
	}

  get collection() { return Partners; }
  get documents() { return this.partners; }
}

export default angular.module('partners', [
  angularMeteor
])
  .component('partners', {
    templateUrl: template,
    controller: PartnersCtrl
  });
