import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { AnomalyTriggers } from '../../../api/anomalyTriggers';
import { AdminComponent } from '../../../AdminComponent';
import add from '../add/controller';
import edit from '../edit/controller';

_ = lodash;

class AnomalyTriggersCtrl extends AdminComponent {
	constructor($scope, $meteor, $reactive, $timeout) {
    super($scope, $meteor, $reactive, {
      subscriptions: ['anomalyTriggers'],
      helpers: {
        anomalyTriggers() {
          return AnomalyTriggers.find();
        }
      }
    });
	}
}

export default angular.module('anomaly-triggers', [
  angularMeteor,
  add.name,
  edit.name,
])
  .component('anomalytriggers', {
    templateUrl: template,
    controller: AnomalyTriggersCtrl
  });
