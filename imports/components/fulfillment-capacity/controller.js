import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { TimeSlots } from '../../api/timeSlots';
import { EditGuards } from '../../client/EditGuards';
_ = lodash;

class FulfillmentCapacityCtrl {
	constructor($scope, $meteor, $reactive) {
    $scope.viewModel(this);
    $reactive(this).attach($scope);
    this.timeSlots = [];
    this.subscribe('timeSlots');
    this.times = [];
    for (var i = 7; i <= 22; ++ i) {
      this.times.push(_.padStart(i, 2, '0') + ':00');
    }
    this.helpers({
      timeSlots() {
        return TimeSlots.find();
      }
    });

    this.editGuards = new EditGuards({
      timeSlots: {
        collection: TimeSlots
      }
    });
	}
  amPm(time) {
    var date = new Date(Date.parse('Jan 1 ' + time));
    var hours = date.getHours();
    var suffix = hours >= 12 ? "PM":"AM";
    hours = ((hours + 11) % 12 + 1); 

    return hours + ':' + _.padStart(date.getMinutes(), 2, 0) + ' ' + suffix;
  }
  addTimeSlot() {
    this.newTimeSlot = {
      days:{0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
      start:null,
      end:null,
      capacity:null
    };
  }
  saveTimeSlot() {
    TimeSlots.insert(this.newTimeSlot);
    delete this.newTimeSlot;
  }
  cancelAdd() {
    delete this.newTimeSlot;
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
}

export default angular.module('fulfillmentcapacity', [
  angularMeteor
])
  .filter('editGuard', EditGuards.filter)
  .component('fulfillmentcapacity', {
    templateUrl: template,
    controller: FulfillmentCapacityCtrl,
    bindings: {
      order: '<'
    }
  });
