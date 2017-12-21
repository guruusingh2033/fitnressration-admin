import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import form from '../form/controller';
import { Promotions } from '../../../api/promotions';
import { AdminComponent } from '../../../AdminComponent';
import { resolve } from '../helpers';
import { convertToDate } from '../../../date';
_ = lodash;


class EditPromotionCtrl extends AdminComponent {
	constructor($scope, $meteor, $reactive, $timeout) {
    super($scope, $meteor, $reactive);
    this.subscribe('promotions');
    this.helpers({
    	promotion() {
    		var promotion = _.mapValues(_.cloneDeep(Promotions.findOne({_id:new Mongo.ObjectID(this.promotionId)})), (value, key) => {
          switch (key) {
            case 'start':
            case 'end':
            case 'fulfillmentStart':
            case 'fulfillmentEnd':
              return convertToDate(value);
            case 'mealPlan':
            case 'portion':
            case 'bundleType':
              if (!value) {
                return {_str:'all'};
              }
            default:
              return value;
          }
        });
        if (promotion.usageLimit) {
          promotion.limitedUsage = true;
        }
        if (promotion.premiumAllowance) {
          promotion.hasPremiumAllowance = true;
        }
        if (promotion.premiumCap) {
          promotion.hasPremiumCap = true;
        }
        return promotion;
    	}
    });
    this.$timeout = $timeout;
	}
	save(promotion) {
    console.log(promotion, this.promotionId, resolve(promotion));
		Promotions.update({_id:new Mongo.ObjectID(this.promotionId)}, {$set:resolve(promotion)});
    this.saved = true;
    this.$timeout(() => {
      this.saved = false;
    }, 5000);
	}
}

export default angular.module('edit-promotion', [
  angularMeteor,
  form.name
])
  .component('editpromotion', {
    templateUrl: template,
    controller: EditPromotionCtrl,
    bindings: {
    	promotionId: '<'
    }
  });
