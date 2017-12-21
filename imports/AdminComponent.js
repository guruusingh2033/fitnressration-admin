import { MealPlans } from './api/mealPlans';
import { Portions } from './api/portions';
import { BundleTypes } from './api/bundleTypes';
import { Ingredients } from './api/ingredients';
import { Meals } from './api/meals';
import { AddOns } from './api/addOns';
import { TimeSlots } from './api/timeSlots';
import { Orders } from './api/orders';
import { Surveys } from './api/surveys';
_ = lodash;

export class AdminComponent {
  static collection(collectionName) {
    return ({
      'Meals': Meals,
      'BundleTypes': BundleTypes,
      'Portions': Portions,
      'MealPlans': MealPlans,
      'AddOns': AddOns,
      'TimeSlots': TimeSlots,
      'Orders': Orders,
      'Ingredients': Ingredients,
      'Surveys': Surveys,
    })[collectionName];
  }
  static collections(...collectionNames) {
    return _.map(collectionNames, AdminComponent.collection);
  }
	constructor($scope, $meteor, $reactive, config={}) {
    $scope.viewModel(this);
    $reactive(this).attach($scope);
    this._subscribe = this.subscribe;
    this.subscriptions = {};
    this.subscribe = function() {
      this.loading = true;
      var count = arguments.length;
      var timerId = setInterval(() => {
        console.log('waiting...');
        if (DDP._allSubscriptionsReady()) {
          console.log('ready');
          if (config.onSubscribed) {
            config.onSubscribed.apply(this);
          }
          this.loading = false;
          $scope.$apply();
          clearInterval(timerId);
        }
      }, 100);
      var doneLoading = (applyScope=true) => {
        // console.log(count);
        // if (!--count) {
        //   if (config.onSubscribed) {
        //     config.onSubscribed.apply(this);
        //   }
        //   this.loading = false;
        //   if (applyScope) $scope.$apply();
        // }
      }
      for (let arg of arguments) {
        this.subscriptions[arg] = this._subscribe(arg, null, {
          onReady() {
            doneLoading();
            if (config.onSubscription && config.onSubscription[arg]) {
              config.onSubscription[arg]();
            }
            $scope.$apply();
          }
        });
        if (this.subscriptions[arg].ready()) {
          doneLoading(false);
        }
      }
      // console.log(this.subscriptions);
    }
    if (config.subscriptions) {
      this.subscribe.apply(this, config.subscriptions);
    }
    if (config.uses) {
      this.uses.apply(this, config.uses);
    }
    if (config.helpers) {
      this.helpers(config.helpers);
    }
  }
  uses(...features) {
    for (let feature of features) {
      switch (feature) {
        case 'mealPlans':
          this.subscribe('mealPlans');
          this.helpers({
            mealPlans() {
              return MealPlans.find();
            }
          });
          break;

        case 'portions':
          this.subscribe('portions');
          this.helpers({
            portions() {
              return Portions.find();
            }
          });
          break;

        case 'bundleTypes':
          this.subscribe('bundleTypes');
          this.helpers({
            bundleTypes() {
              return BundleTypes.find({}, {sort:{price:1}});
            }
          });
          break;

        case 'ingredients':
          this.subscribe('ingredients');
          this.helpers({
            ingredients() {
              return Ingredients.find();
            }
          });
          break;

        case 'meals':
          this.subscribe('meals');
          this.helpers({
            meals() {
              return Meals.find();
            }
          });
          break;

        case 'addOns':
          this.subscribe('addOns');
          this.helpers({
            addOns() {
              return AddOns.find();
            }
          });
          break;

        case 'timeSlots':
          this.subscribe('timeSlots');
          this.helpers({
            timeSlots() {
              return TimeSlots.find();
            }
          });
          break;
      }
    }
  }
  mealPlan(id) {
    return MealPlans.findOne({_id:id});
  }
  portion(id) {
    return Portions.findOne({_id:id});
  }
  bundleType(id) {
    return BundleTypes.findOne({_id:id});
  }
  ingredient(id) {
    return Ingredients.findOne({_id:id});
  }
}
