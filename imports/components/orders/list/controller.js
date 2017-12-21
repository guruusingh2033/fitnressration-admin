import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { formatDate, timeDisplay } from '../../../helpers';
import { AdminComponent } from '../../../AdminComponent';
import { ListAdminComponent } from '../../../ListAdminComponent';
_ = lodash;

[ Orders, MealPlans, Portions, Meals, AddOns ] = AdminComponent.collections('Orders', 'MealPlans', 'Portions', 'Meals', 'AddOns');

const DAY_LENGTH = 86400*1000;
window.g_Orders = Orders;

class OrdersCtrl extends ListAdminComponent {
	constructor($scope, $meteor, $reactive, $http) {
    super($scope, $meteor, $reactive, {
      subscriptions: ['meals', 'addOns'],
      helpers: {
        orders() {

          var minDate;
          var maxDate;
          var now = new Date();
          var filter = this.getReactively('filters.search');
          var query = {state:{$in:['completed', 'failed']}};
          var sortField = this.getReactively('sortField');
          var sortDirection = this.getReactively('sortDirection');

          if (this.userId) {
            query.userId = this.userId;
          }
          
          if (filter) {
            var pattern = new RegExp(filter, 'i')
            var users = Meteor.users.find({username:pattern}).map(user => user._id);
            var meals = Meals.find({name:pattern}).map(meal => meal._id);
            var addOns = AddOns.find({name:pattern}).map(addOn => addOn._id);
            
            query.$or = [
              {'transaction.id':filter},
              {number:parseInt(filter)},
              {bundles:{$elemMatch:{'type.name': pattern}}},
              {bundles:{$elemMatch:{'portion.name': pattern}}},
              {bundles:{$elemMatch:{'mealPlan.name': pattern}}},
              {'deliveryOptions.address': pattern},
              {'deliveryOptions.postalCode': filter},
              {'deliveryOptions.firstName': pattern},
              {'deliveryOptions.surname': pattern},
              {'deliveryOptions.contactNumber': pattern},
              {'deliveryOptions.deliveryNote': pattern},
              {userId: {$in:users}},
              {bundles:{$elemMatch:{mealSelections:{$elemMatch:{'meal._id':{$in:meals}}}}}},
              {addOnSelections:{$elemMatch:{$or:[{'addOn._id':{$in:addOns}}, {variant:pattern}]}}}
            ];
          }

          switch (this.getReactively('filters.time')) {
            case 'day':
              if (this.getReactively('day')) {
                minDate = this.day;
                maxDate = new Date(minDate.getTime() + DAY_LENGTH);
              }
              break;
            case 'week':
              if (this.getReactively('week')) {
                minDate = new Date(this.week.getFullYear(), this.week.getMonth(), this.week.getDate() - this.week.getDay());
                maxDate = new Date(this.week.getFullYear(), this.week.getMonth(), this.week.getDate() + (7 - this.week.getDay()));
              }
              break;
            case 'month':
              if (this.getReactively('month')) {
                minDate = new Date(this.month.getFullYear(), this.month.getMonth(), 1);
                maxDate = new Date(this.month.getFullYear(), this.month.getMonth() + 1, 1);
              }
              break;
          }

          if (minDate && maxDate) {
            query['deliveryOptions.date'] = {$gte:formatDate(minDate), $lt:formatDate(maxDate)};          
          }

          var sort = {};
          if (sortField == 'fulfillment') {
            sort['deliveryOptions.date'] = sortDirection;
            sort['deliveryOptions.time'] = sortDirection;
          }
          else if (sortField == 'customer') {
            sort['deliveryOptions.firstName'] = sortDirection;
            sort['deliveryOptions.surname'] = sortDirection;
          }
          else {
            sort[sortField] = sortDirection;
          }
          sort._id = -1;
          var orders = Orders.find(query, {sort:sort}).fetch();
          return orders;
        }
      }
    });
    window.g_ordersController = this;

    this._subscribe('ordersByDate', () => {
      var minDate, maxDate;
      switch (this.getReactively('filters.time')) {
        case 'day':
          if (this.getReactively('day')) {
            minDate = this.day;
            maxDate = new Date(minDate.getTime() + DAY_LENGTH);
          }
          break;
        case 'week':
          if (this.getReactively('week')) {
            minDate = new Date(this.week.getFullYear(), this.week.getMonth(), this.week.getDate() - this.week.getDay());
            maxDate = new Date(this.week.getFullYear(), this.week.getMonth(), this.week.getDate() + (7 - this.week.getDay()));
          }
          break;
        case 'month':
          if (this.getReactively('month')) {
            minDate = new Date(this.month.getFullYear(), this.month.getMonth(), 1);
            maxDate = new Date(this.month.getFullYear(), this.month.getMonth() + 1, 1);
          }
          break;
      } 
      return [formatDate(minDate), formatDate(maxDate)]
    });

    // $meteor.autorun($scope, () => {
    // })
    this.$http = $http;
    this.filters = {
    	time: 'day',
    	flagged: false
    };

    $scope.$watch('$ctrl.filters', () => {
      this.selected = {};
    }, true);
    
    this.day = new Date();
    this.month = new Date();
    this.week = new Date();

    this.sortField = 'number';
    this.sortDirection = -1;
	}

  toggleSort(field) {
    if (this.sortField == field) {
      if (this.sortDirection == -1) {
        this.sortDirection = 1;
      }
      else {
        this.sortDirection = -1;
      }
    }
    else {
      this.sortField = field;
      this.sortDirection = -1;
    }
  }

  get collection() { return Orders; }
  get documents() { return this.orders; }

  timeDisplay(time) {
    return timeDisplay(time);
  }
  printInvoices() {
    window.open(Meteor.settings.public.userDashboardUrl + 'api/admin/invoices?orders=' + this._selected);
  }
  export() {
    window.open(Meteor.settings.public.exportUrl + 'delivery.php?orders=' + this._selected);
  }
}

export default angular.module('orders', [
  angularMeteor
])
	.filter('orders', function() {
		return function(input, filters) {
			return _.filter(input, function(obj) {
				if (filters.flagged) {
					if (obj.flagged) {
						return true;
					}
					else {
						return false;
					}
				}
				else {
					return true;
				}
			});
		}
	})
  .component('orders', {
    templateUrl: template,
    controller: OrdersCtrl,
    bindings: {
      userId: '<'
    }
  });
