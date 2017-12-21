import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { ListAdminComponent } from '../../../ListAdminComponent';
_ = lodash;

class IngredientsCtrl extends ListAdminComponent {
	constructor($scope, $meteor, $reactive) {
    super($scope, $meteor, $reactive, {
      uses: ['ingredients']
    });
	}

  get collection() { return 'Ingredients'; }
  get documents() { return this.ingredients; }

  icon(ingredient) {
    return Meteor.settings.public.imageServerUrl + '/image.php?image=' + ingredient.icon;
  }
}

export default angular.module('ingredients', [
  angularMeteor
])
  .component('ingredients', {
    templateUrl: template,
    controller: IngredientsCtrl
  });
