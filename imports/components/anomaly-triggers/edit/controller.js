import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import form from '../form/controller';
import { AdminComponent } from '../../../AdminComponent';
import { resolve } from '../helpers';
import { AnomalyTriggers } from '../../../api/anomalyTriggers';
_ = lodash;

class EditAnomalyTriggerCtrl extends AdminComponent {
	constructor($scope, $meteor, $reactive, $timeout) {
    super($scope, $meteor, $reactive, {
      subscriptions: ['anomalyTriggers'],
      helpers: {
        anomalyTrigger() {
          return _.mapValues(_.cloneDeep(AnomalyTriggers.findOne({_id:new Mongo.ObjectID(this.anomalyTriggerId)})), (value, key, object) => {

            if (object.productType == 'addOn') {
              switch (key) {
                case 'addOn':
                  if (!value) {
                    return {_str:'all'};
                  }
                  break;
              }
            }
            else if (object.productType == 'meal') {
              switch (key) {
                case 'meal':
                  if (!value) {
                    return 'all';
                  }
                  break;
                case 'mealPlan':
                case 'portion':
                  if (!value) {
                    return {_str:'all'};
                  }
                  break;
              }
            }
            return value;
          });
        }
      }
    });
    this.$timeout = $timeout;
	}
  delete() {
    AnomalyTriggers.remove({_id:new Mongo.ObjectID(this.anomalyTriggerId)});
  }
	save(anomalyTrigger) {
    AnomalyTriggers.update({_id:new Mongo.ObjectID(this.anomalyTriggerId)}, {$set:resolve(anomalyTrigger)});
    this.saved = true;
    this.$timeout(() => {
      this.saved = false;
    }, 5000);
	}
}

export default angular.module('edit-anomaly-trigger', [
  angularMeteor,
  form.name
])
  .component('editanomalytrigger', {
    templateUrl: template,
    controller: EditAnomalyTriggerCtrl,
    bindings: {
      anomalyTriggerId: '<',
    }
  });
