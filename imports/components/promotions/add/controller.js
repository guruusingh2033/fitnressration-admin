import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { Promotions } from '../../../api/promotions';
import form from '../form/controller';
import { formatDate } from '../../../helpers';
import { resolve } from '../helpers';
_ = lodash;

class AddPromotionCtrl {
  constructor($scope, $meteor, $reactive) {
    $scope.viewModel(this);
    $reactive(this).attach($scope);
  }
  add(promotionData) {
    var promotionId = Promotions.insert(resolve(promotionData));
    FlowRouter.go('editPromotion', { promotionId: promotionId._str });
  }
}

export default angular.module('add-promotion', [
  angularMeteor,
  form.name
])
  .component('addpromotion', {
    templateUrl: template,
    controller: AddPromotionCtrl
  });
