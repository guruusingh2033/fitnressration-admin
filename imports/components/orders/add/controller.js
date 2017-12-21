import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { weeksForMonth, today, formatDate } from '../../../date';
import { AdminComponent } from '../../../AdminComponent';
import { monthName } from '../../../helpers';
_ = lodash;

[ MealPlans, Portions, BundleTypes, Meals, Ingredients, TimeSlots ] = AdminComponent.collections('MealPlans', 'Portions', 'BundleTypes', 'Meals', 'Ingredients', 'TimeSlots');


function amPm(time, appendSuffix=true) {
  var date = new Date(Date.parse('Jan 1 ' + time));
  var hours = date.getHours();
  var suffix = hours >= 12 ? "pm":"am";
  hours = ((hours + 11) % 12 + 1); 

  return hours + (appendSuffix ? '' + suffix : '');
}


class AddOrderCtrl extends AdminComponent {
	constructor($scope, $meteor, $reactive, $http) {
    super($scope, $meteor, $reactive, {
      uses: ['mealPlans', 'portions', 'bundleTypes', 'meals', 'timeSlots'],
      subscriptions: ['ingredients', 'users'],
      helpers: {
        allergens() {
          return Ingredients.find({type:'allergen'});
        }
      }
    });
    this.$http = $http;

    this.order = {
      bundles: []
    };

    $scope.$watch('$ctrl.user.email', () => {
      if (this.user) {
        var user = Meteor.users.findOne({username:this.user.email});
        this.orderUser = user;
        if (this.orderUser) {
          this.user.firstName = this.orderUser.profile.firstName;
          this.user.surname = this.orderUser.profile.surname;
          this.user.phoneNumber = this.orderUser.profile.phoneNumber;
        }
      }
    }, true);

    this.month = new Date();
    this.today = today();
    this.weeks = weeksForMonth(this.month);

    $scope.$watch('$ctrl.order.bundles', () => {
      this.updateCalendar();
    }, true);

    this.addBundle();
	}

  monthName(month) {
    return monthName(month);
  }

  prevMonth() {
    this.month = new Date(this.month.getFullYear(), this.month.getMonth() - 1, 1, 0, 0, 0);
    this.weeks = weeksForMonth(this.month);
    this.updateCalendar();
  }

  nextMonth() {
    this.month = new Date(this.month.getFullYear(), this.month.getMonth() + 1, 1, 0, 0, 0);
    this.weeks = weeksForMonth(this.month);
    this.updateCalendar();
  }

  updateCalendar() {
    var order;
    try {
      order = this.serializedOrder();
    }
    catch (e) {
      this.timeSlotsForDates = null;
      // this.timeSlotsForSelectedDate = null;
      // if (this.order.deliveryOptions) {
      //   this.order.deliveryOptions.time = null;
      //   this.order.deliveryOptions.date = null;
      // }
    }
    if (order) {
      this.$http({
        method:'POST',
        url:Meteor.settings.public.userDashboardUrl + 'api/delivery/calendar?month=' + this.month.getFullYear() + '-' + (this.month.getMonth() + 1),
        data:{
          order:order,
        },
        headers: {
          'X-Auth-Token':localStorage.getItem('Meteor.loginToken'),
          'X-User-Id':Meteor.userId()
        }
      }).then((response) => {
        this.timeSlotsForDates = response.data;
        // this.timeSlotsForSelectedDate = null;
        // if (this.order.deliveryOptions) {
        //   this.order.deliveryOptions.date = null;
        //   this.order.deliveryOptions.time = null;
        // }
      });
    }
  }
  dateAvailable(date) {
    return this.timeSlotsForDates && this.timeSlotsForDates[formatDate(date)] && this.timeSlotsForDates[formatDate(date)].length;
  }
  selectDate(date) {
    if (this.dateAvailable(date)) {
      if (!this.order.deliveryOptions) {
        this.order.deliveryOptions = {};
      }
      this.order.deliveryOptions.date = formatDate(date);
      this.timeSlotsForSelectedDate = _.map(this.timeSlotsForDates[this.order.deliveryOptions.date], (timeSlotId) => { return TimeSlots.findOne({_id:new Mongo.ObjectID(timeSlotId)}); });      
      this.showCalendar = false;
    }
  }
  dateSelected(date) {
    return this.order.deliveryOptions && formatDate(date) == this.order.deliveryOptions.date;
  }
  timeSlotTitle(timeSlot) {
    return timeSlot.start + '-' + timeSlot.end;
  }
  bundleValid(bundle) {
    var totalMeals = 0;
    if (!(bundle.type && bundle.portion && bundle.mealPlan)) return false;
    for (var mealSelection of bundle.mealSelections) {
      if (!mealSelection.meal) return false;
      totalMeals += parseInt(mealSelection.quantity);
    }
    if (_.isNaN(totalMeals) || totalMeals != bundle.type.basicMeals) {
      return false;
    }
    return true;
  }
  serializedOrder(userId) {
    var order = {
      userId:userId,
      bundles: _.map(this.order.bundles, (bundle) => {
        return {
          mealPlan:bundle.mealPlan._id._str,
          portion:bundle.portion._id._str,
          type:bundle.type._id._str,
          allergies:_.transform(bundle.allergies, (allergies, enabled, id) => {
            if (enabled) {
              allergies.push(id);
            }
          }, []),
          mealSelections:_.transform(bundle.mealSelections, (mealSelections, mealSelection) => {
            mealSelections.push({
              mealId:mealSelection.meal._id._str,
              quantity:mealSelection.quantity
            });
          })
        };
      }),
    };

    if (this.order.deliveryOptions) {
      order.deliveryOptions = {
        date:this.order.deliveryOptions.date,
        time:this.order.deliveryOptions.time ? this.order.deliveryOptions.time._id._str : null,
        address:this.order.deliveryOptions.address,
        postalCode:this.order.deliveryOptions.postalCode,
        note:this.order.deliveryOptions.note,
        disposableCutlery:this.order.deliveryOptions.disposableCutlery,
        selfCollection:this.order.deliveryOptions.fulfillmentMethod == 'selfCollection',
      };
    }

    return order;
  }
  add() {
    for (var bundle of this.order.bundles) {
      if (!this.bundleValid(bundle)) {
        return;
      }
    }

    var addOrder = (userId) => {
      var order = this.serializedOrder(userId);
      this.$http({
        method:'POST',
        url:Meteor.settings.public.userDashboardUrl + 'api/orders',
        data:order,
        headers: {
          'X-Auth-Token':localStorage.getItem('Meteor.loginToken'),
          'X-User-Id':Meteor.userId()
        }
      }).then(function(response) {
        FlowRouter.go(`/orders/${response.data.orderId}`);
      });
    };

    var user = Meteor.users.findOne({username:this.user.email});
    if (!user) {
      Meteor.call('createUser', {
        username:this.user.email,
        email:this.user.email,
        password:'password',
        profile: {
          firstName:this.user.firstName,
          surname:this.user.surname,
          phoneNumber:this.user.phoneNumber,
          deliveryAddresses:[{
            address:this.order.deliveryOptions.address,
            postalCode:this.order.deliveryOptions.postalCode
          }],
          selectedDeliveryAddress:0
        }
      }, (error, response) => {
        addOrder(response.orderId);
      });
    }
    else {
      addOrder(user._id)
    }
  }
  addBundle() {
    this.order.bundles.push({mealSelections:[], allergies:{}});
  }
  removeBundle(index) {
    this.order.bundles.splice(index, 1);
  }
  addMeal(bundle) {
    bundle.mealSelections.push({});
  }
  removeMeal(bundle, index) {
    bundle.mealSelections.splice(index, 1);
  }
}

export default angular.module('add-order', [
  angularMeteor
])
  .filter('bundleTypes', function() {
    return function(bundleTypes, bundle) {
      if (bundle.portion && bundle.mealPlan) {
        return _.filter(bundleTypes, function(bundleType) {
          return bundleType.portion._str == bundle.portion._id._str && bundleType.mealPlan._str == bundle.mealPlan._id._str;
        });        
      }
      else {
        return [];
      }
    }
  })
  .filter('meals', function() {
    return function(meals, bundle) {
      if (bundle.portion && bundle.mealPlan) {
        return _.filter(meals, function(meal) {
          return meal.portion._str == bundle.portion._id._str && meal.mealPlan._str == bundle.mealPlan._id._str;
        });        
      }
      else {
        return [];
      }
    }
  })
  .component('addorder', {
    templateUrl: template,
    controller: AddOrderCtrl
  });
