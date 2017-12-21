import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { FulfillmentSettings } from '../../api/fulfillmentSettings';

_ = lodash;

class FulfillmentSettingsCtrl {
	constructor($scope, $meteor, $reactive) {
    $scope.viewModel(this);
    $reactive(this).attach($scope);
    var fulfillmentSettingsSub = this.subscribe('fulfillmentSettings');
    this.autorun(() => {
      if (!this.inited && fulfillmentSettingsSub.ready()) {
        this.inited = true;
        this.fulfillmentSettings = FulfillmentSettings.findOne({});
        this.minDays = this.fulfillmentSettings.minDays;
        this.cutoffTime = this.fulfillmentSettings.cutoffTime;
      }
    });
    this.helpers({
      fulfillmentSettingsDoc() {
        return FulfillmentSettings.findOne({});
      }
    });
	}

  minDays_save() {
    this.fulfillmentSettings.minDays = this.minDays;
    FulfillmentSettings.update({_id:this.fulfillmentSettings._id}, {$set:{'minDays':this.minDays, 'timestamps.minDays':new Date()}});
  }
  minDays_cancel() {
    this.minDays = this.fulfillmentSettings.minDays;
  }
  minDays_hasChanges() {
    return this.fulfillmentSettings && this.minDays != this.fulfillmentSettings.minDays;
  }
  
  cutoffTime_save() {
    this.fulfillmentSettings.cutoffTime = this.cutoffTime;
    FulfillmentSettings.update({_id:this.fulfillmentSettings._id}, {$set:{'cutoffTime':this.cutoffTime, 'timestamps.cutoffTime':new Date()}});
  }
  cutoffTime_cancel() {
    this.cutoffTime = this.fulfillmentSettings.cutoffTime;
  }
  cutoffTime_hasChanges() {
    return this.fulfillmentSettings && this.cutoffTime != this.fulfillmentSettings.cutoffTime;
  }
}

export default angular.module('fulfillmentsettings', [
  angularMeteor
])
  // .filter('editGuard', EditGuards.filter)
  .component('fulfillmentsettings', {
    templateUrl: template,
    controller: FulfillmentSettingsCtrl
  });
