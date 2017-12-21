import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { Blocks } from '../../api/blocks';
import { Orders } from '../../api/orders';
import { TimeSlots } from '../../api/timeSlots';
import { EditGuards } from '../../client/EditGuards';
import { weeksForMonth, today, formatDate } from '../../date';
import { monthName } from '../../helpers';

_ = lodash;

function amPm(time, appendSuffix=true) {
  var date = new Date(Date.parse('Jan 1 ' + time));
  var hours = date.getHours();
  var suffix = hours >= 12 ? "pm":"am";
  hours = ((hours + 11) % 12 + 1); 

  return hours + (appendSuffix ? '' + suffix : '');
}

class FulfillmentScheduleCtrl {
	constructor($scope, $meteor, $reactive) {
    $scope.viewModel(this);
    $reactive(this).attach($scope);
    this.month = new Date();
    this.today = today();
    this.weeks = weeksForMonth(this.month);

    var blocksSub = this.subscribe('blocks');
    var ordersSub = this.subscribe('orders');
    var timeSlotsSub = this.subscribe('timeSlots');

    this.ordersForDate = {};
    this.timeSlots = {};

    this.dates = {};

    this.autorun(() => {
      var month = this.getReactively('month');
      if (blocksSub.ready() && ordersSub.ready() && timeSlotsSub.ready()) {
        this.timeSlots = {};
        TimeSlots.find().forEach((timeSlot) => {
          this.timeSlots[timeSlot._id._str] = timeSlot;
        });
        var minDate = new Date(month.getFullYear(), month.getMonth(), 1);
        var maxDate = new Date(month.getFullYear(), month.getMonth() + 1, 1);
        var query = {state:'completed'};
        query['deliveryOptions.date'] = {$gte:formatDate(minDate), $lt:formatDate(maxDate)};
        var orders = Orders.find(query).fetch();
        this.ordersForDate = {};
        this.dates = {};
        for (var order of orders) {
          if (!this.ordersForDate[order.deliveryOptions.date]) {
            this.ordersForDate[order.deliveryOptions.date] = [];
          }
          this.ordersForDate[order.deliveryOptions.date].push(order);
        }
      }
    });
    this.helpers({
      blocks() {
        return Blocks.find();
      }
    });
    this.editGuards = new EditGuards({
      blocks: {
        collection: Blocks
      }
    });
	}

  monthName(month) {
    return monthName(month);
  }

  prevMonth() {
    this.month = new Date(this.month.getFullYear(), this.month.getMonth() - 1, 1, 0, 0, 0);
    this.weeks = weeksForMonth(this.month);
  }

  nextMonth() {
    this.month = new Date(this.month.getFullYear(), this.month.getMonth() + 1, 1, 0, 0, 0);
    this.weeks = weeksForMonth(this.month);
  }

  blocked(date) {
    for (var block of this.blocks) {
      if (date.valueOf() >= block.start.valueOf() && date.valueOf() <= block.end.valueOf()) {
        return true;
      }
    }
    return false;
  }

  orderSummaryForDate(date) {
    var date = formatDate(date);
    if (this.dates[date] && this.dates[date].summary) {
      return this.dates[date].summary;
    }
    else {
      if (!this.dates[date]) this.dates[date] = {};
      return this.dates[date].summary = this.summarize(this.ordersForDate[date]);
    }
  }

  summarize(orders) {
    if (orders) {
      var grouped = {};
      for (var order of orders) {
        var key = order.deliveryOptions.time._id._str;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(order);
      }

      var list = [];
      for (var key in grouped) {
        var timeSlot = this.timeSlots[key];
        if (timeSlot) {
          list.push({timeSlot:amPm(timeSlot.start, false) + '-' + amPm(timeSlot.end), orders:grouped[key].length + ' orders'});          
        }
      }
      return list;
    }
    else {
      return [];
    }
  }

  addNewBlock() {
    this.newBlock = {};
  }
  cancelNewBlock() {
    delete this.newBlock;
  }
  saveNewBlock() {
    Blocks.insert(this.newBlock);
    delete this.newBlock;
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

export default angular.module('fulfillmentschedule', [
  angularMeteor
])
  .filter('editGuard', EditGuards.filter)
  .component('fulfillmentschedule', {
    templateUrl: template,
    controller: FulfillmentScheduleCtrl,
    bindings: {
      order: '<'
    }
  });
