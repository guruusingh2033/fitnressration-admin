import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { StockCache } from '../../api/stockCache';
import { MealStock } from '../../api/mealStock';
import { formatDate, timeDisplay, mealSales, monthName } from '../../helpers';
import { addDays, convertToDate, today, calendarDaysForMonth } from '../../date';
import { StockCalculator } from '../../StockCalculator';

import { AdminComponent } from '../../AdminComponent';

_ = lodash;

[ MealPlans, Portions, Orders, Meals ] = AdminComponent.collections('MealPlans', 'Portions', 'Orders', 'Meals');

class InventoryStatusCtrl extends AdminComponent {
  constructor($scope, $meteor, $reactive, $http) {
    super($scope, $meteor, $reactive, {
      subscriptions: ['futureOrders', 'meals'],
      uses: ['mealPlans', 'portions'],
      onSubscribed() {
        console.log('okay');
      },
      helpers: {
        meals() {
          switch (this.getReactively('timeView')) {
            case 'day': 
              var filter = this.getReactively('filter');
              var query = {};
              if (filter) {
                var mealPlans = MealPlans.find({name:new RegExp(filter, 'i')}).fetch().map(mealPlan => mealPlan._id);
                var portions = Portions.find({name:new RegExp(filter, 'i')}).fetch().map(portion => portion._id);
                query.$or = [{name:new RegExp(filter, 'i')}, {sku:new RegExp(filter, 'i')}, {mealPlan:{$in:mealPlans}}, {portion:{$in:portions}}];
              }
              
              return Meals.find(query).fetch();

            case 'month':
              var portion = this.getReactively('portionFilter');
              var mealPlan = this.getReactively('mealPlanFilter');
              if (portion && mealPlan) {
                return Meals.find({portion:new Mongo.ObjectID(portion), mealPlan:new Mongo.ObjectID(mealPlan)});
              }
              else {
                return [];
              }
          }
        }
      }
    });
    this.view = 'overview';

    this._subscribe('mealStockForDates', () => [formatDate(today()), formatDate(today())]);
    this._subscribe('mealStockForDates', () => [formatDate(this.getReactively('date')), formatDate(this.getReactively('date'))]);

    this.autorun(() => {
      FlowRouter.watchPathChange();
      this.view = FlowRouter.current().route.options.view;
    });

    Portions.find();
    MealPlans.find();

    this.date = new Date();

    this._stockCalculators = {};

    this.timeView = 'day';

    this.days = calendarDaysForMonth(this.date, false);
  }

  pastDay() {
    return this.date.valueOf() < today().valueOf();
  }

  stockTotal(meal) {
    var total = 0;
    for (var day of this.days) {
      total += this.stockCalculator(meal).forDate(day).stock || 0;
    }
    return total;
  }

  monthName(month) {
    return monthName(month);
  }

  stockCalculator(meal) {    
    if (!this._stockCalculators[meal._id._str]) {
      this._stockCalculators[meal._id._str] = new StockCalculator(meal._id);
    }
    return this._stockCalculators[meal._id._str];
  }

  export() {
    window.open(`/api/export-inventory-status?filter=${this.filter || ''}&date=${formatDate(this.date)}`);
  }

  get propName() {
    return ({
      nonSales: 'Non-sales',
      'restock': 'Restock',
      adjustment: 'Adjustment'
    })[this.view];
  }
}

export default angular.module('inventory-status', [
  angularMeteor
])
  .controller('inventoryStatusItem', function($scope) {
    var item = {};
    var currentValue, prop;
    var mealStock = MealStock.findOne({meal:$scope.meal._id, date:formatDate($scope.$ctrl.date)}) || {};

    function reset() {
      mealStock = MealStock.findOne({meal:$scope.meal._id, date:formatDate($scope.$ctrl.date)}) || {};
      prop = $scope.$ctrl.view
      currentValue = mealStock[prop] || 0;
    }

    $scope.$watch('$ctrl.view', reset, true);
    $scope.$watch('$ctrl.date', reset, true);

    Object.defineProperty(item, 'hasChanges', {
      get: () => {
        return (mealStock[prop] || 0) != currentValue;
      }
    });

    item.save = () => {
      var update = {};
      mealStock[prop] = update[prop] = currentValue;
      if (!mealStock.lastUpdated) mealStock.lastUpdated = {};
      mealStock.lastUpdated[prop] = update['lastUpdated.' + prop] = new Date();
      if (mealStock._id) {
        MealStock.update({_id:mealStock._id}, {$set:update});        
      }
      else {
        var values = {
          date: formatDate($scope.$ctrl.date),
          meal: $scope.meal._id,
          lastUpdated: {}
        };
        values[prop] = currentValue;
        values.lastUpdated[prop] = new Date();
        MealStock.insert(values);
      }


      Meteor.call('clearStockCache');

      delete $scope.$ctrl._stockCalculators[$scope.meal._id._str];
    };

    Object.defineProperty(item, 'lastUpdated', {
      get: () => {
        return mealStock.lastUpdated ? mealStock.lastUpdated[prop] : null
      }
    });

    Object.defineProperty(item, 'value', {
      get: () => {
        return currentValue;
      },
      set: (value) => {
        currentValue = value;
      }
    });
    $scope.item = item;
  })
  .component('inventorystatus', {
    templateUrl: template,
    controller: InventoryStatusCtrl
  });
