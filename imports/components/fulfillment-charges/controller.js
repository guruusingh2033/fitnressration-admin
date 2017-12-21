import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { LocationSurcharges } from '../../api/locationSurcharges';
import { FulfillmentSettings } from '../../api/fulfillmentSettings';
import { EditGuards } from '../../client/EditGuards';

_ = lodash;

class FulfillmentChargesCtrl {
	constructor($scope, $meteor, $reactive) {
    $scope.viewModel(this);
    $reactive(this).attach($scope);
    this.subscribe('locationSurcharges');
    var fulfillmentSettingsSub = this.subscribe('fulfillmentSettings');
    this.autorun(() => {
      if (!this.inited && fulfillmentSettingsSub.ready()) {
        this.inited = true;
        this.fulfillmentSettings = FulfillmentSettings.findOne({});
        this.freeDeliveryThreshold = this.fulfillmentSettings.freeDeliveryThreshold;
        this.deliveryFee = this.fulfillmentSettings.deliveryFee;
      }
    });
    this.helpers({
      locationSurcharges() {
        return LocationSurcharges.find();
      },
      fulfillmentSettingsDoc() {
        return FulfillmentSettings.findOne({});
      }
    });
    this.editGuards = new EditGuards({
      locationSurcharges: {
        collection: LocationSurcharges
      }
    });
	}

  addNewLocationSurcharge() {
    this.newLocationSurcharge = {};
  }
  cancelNewLocationSurcharge() {
    delete this.newLocationSurcharge;
  }
  saveNewLocationSurcharge() {
    LocationSurcharges.insert(this.newLocationSurcharge);
    delete this.newLocationSurcharge;
  }

  save(object) {
    this.editGuards.save(object);
  }
  cancel(object) {
    this.editGuards.cancel(object);
  }
  delete(object) {
    this.editGuards.delete(object);
  }
  hasChanges(object) {
    return this.editGuards.hasChanges(object);
  }

  freeDeliveryThreshold_save() {
    this.fulfillmentSettings.freeDeliveryThreshold = this.freeDeliveryThreshold;
    FulfillmentSettings.update({_id:this.fulfillmentSettings._id}, {$set:{'freeDeliveryThreshold':this.freeDeliveryThreshold, 'timestamps.freeDeliveryThreshold':new Date()}});
  }
  freeDeliveryThreshold_cancel() {
    this.freeDeliveryThreshold = this.fulfillmentSettings.freeDeliveryThreshold;
  }
  freeDeliveryThreshold_hasChanges() {
    return this.fulfillmentSettings && this.freeDeliveryThreshold != this.fulfillmentSettings.freeDeliveryThreshold;
  }

  deliveryFee_save() {
    this.fulfillmentSettings.deliveryFee = this.deliveryFee;
    FulfillmentSettings.update({_id:this.fulfillmentSettings._id}, {$set:{'deliveryFee':this.deliveryFee, 'timestamps.deliveryFee':new Date()}});
  }
  deliveryFee_cancel() {
    this.deliveryFee = this.fulfillmentSettings.deliveryFee;
  }
  deliveryFee_hasChanges() {
    return this.fulfillmentSettings && this.deliveryFee != this.fulfillmentSettings.deliveryFee;
  }
}

export default angular.module('fulfillmentcharges', [
  angularMeteor
])
  .filter('editGuard', EditGuards.filter)
  .component('fulfillmentcharges', {
    templateUrl: template,
    controller: FulfillmentChargesCtrl
  });
