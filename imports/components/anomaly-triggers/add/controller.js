import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import form from '../form/controller';
import { AdminComponent } from '../../../AdminComponent';
import { resolve } from '../helpers';
import { AnomalyTriggers } from '../../../api/anomalyTriggers';
_ = lodash;

class AddAnomalyTriggerCtrl extends AdminComponent {
	constructor($scope, $meteor, $reactive, $timeout) {
    super($scope, $meteor, $reactive);
    this.$timeout = $timeout;
    this.newAnomalyTrigger = {};
	}
	save(anomalyTrigger) {
    AnomalyTriggers.insert(resolve(anomalyTrigger));
    this.newAnomalyTrigger = {};
	}
}

export default angular.module('add-anomaly-trigger', [
  angularMeteor,
  form.name
])
  .component('addanomalytrigger', {
    templateUrl: template,
    controller: AddAnomalyTriggerCtrl
  });
