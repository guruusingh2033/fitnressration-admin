import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { AdminComponent } from '../../../AdminComponent';
_ = lodash;

class IngredientFormCtrl extends AdminComponent {
	constructor($scope, $meteor, $reactive) {
    super($scope, $meteor, $reactive);
	}
	save() {
		this.onSave({ingredient:this.ingredient});
	}
  icon(ingredient) {
    if (ingredient) {
      return Meteor.settings.public.imageServerUrl + '/image.php?image=' + ingredient.icon;      
    }
  }
}

export default angular.module('ingredient-form', [
  angularMeteor
])
  .component('ingredientform', {
    templateUrl: template,
    controller: IngredientFormCtrl,
    bindings: {
    	ingredient: '<',
      onSave: '&',
    }
  });
