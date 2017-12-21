import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { AdminComponent } from '../../../AdminComponent';
import { ListAdminComponent } from '../../../ListAdminComponent';
import { Promotions } from '../../../api/promotions';
import { BundleTypes } from '../../../api/bundleTypes';
_ = lodash;

[ Orders ] = AdminComponent.collections('Orders');

class PromotionsCtrl extends ListAdminComponent {
	constructor($scope, $meteor, $reactive) {
    super($scope, $meteor, $reactive, {
      subscriptions: ['promotions', 'bundleTypes', 'mealPlans', 'portions', 'orders'],
      helpers: {
        promotions() {
          var filter = this.getReactively('filter');
          var query = {};
          if (filter) {
            var mealPlans = MealPlans.find({name:new RegExp(filter, 'i')}).fetch().map(mealPlan => mealPlan._id);
            var portions = Portions.find({name:new RegExp(filter, 'i')}).fetch().map(portion => portion._id);
            var bundleTypes = BundleTypes.find({name:new RegExp(filter, 'i')}).fetch().map(bundleType => bundleType._id);
            if (new RegExp(filter, 'i').exec('All')) {
              mealPlans.push(null);
              portions.push(null);
              bundleTypes.push(null);
            }
            query.$or = [{name:new RegExp(filter, 'i')}, {sku:new RegExp(filter, 'i')}, {promoCode:new RegExp(filter, 'i')}, {mealPlan:{$in:mealPlans}}, {portion:{$in:portions}}, {bundleType:{$in:bundleTypes}}];
          }
          return Promotions.find(query);
        }
      }
    });
    BundleTypes.find();
	}

  get collection() { return Promotions; }
  get documents() { return this.promotions; }

  claimedCount(promotion) {
    return Orders.find({bundles:{$elemMatch:{'promotion._id':promotion._id}}}).fetch().length;
  }
}

export default angular.module('promotions', [
  angularMeteor
])
  .component('promotions', {
    templateUrl: template,
    controller: PromotionsCtrl
  });
