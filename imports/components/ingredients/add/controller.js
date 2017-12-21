import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import form from '../form/controller';
import { AdminComponent } from '../../../AdminComponent';
import { resolve } from '../helpers';
_ = lodash;

[ Ingredients ] = AdminComponent.collections('Ingredients');

class AddIngredientCtrl extends AdminComponent {
	constructor($scope, $meteor, $reactive, $timeout) {
    super($scope, $meteor, $reactive);
    this.$timeout = $timeout;
	}
	save(ingredient) {
    var ingredientId = Ingredients.insert(resolve(ingredient));
    FlowRouter.go('editIngredient', { ingredientId: ingredientId._str });
	}
}

export default angular.module('add-ingredient', [
  angularMeteor,
  form.name
])
  .component('addingredient', {
    templateUrl: template,
    controller: AddIngredientCtrl
  });
