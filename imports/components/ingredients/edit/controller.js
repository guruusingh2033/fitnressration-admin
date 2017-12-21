import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import form from '../form/controller';
import { AdminComponent } from '../../../AdminComponent';
import { resolve } from '../helpers';
_ = lodash;
[ Ingredients ] = AdminComponent.collections('Ingredients');

class EditIngredientCtrl extends AdminComponent {
	constructor($scope, $meteor, $reactive, $timeout) {
    super($scope, $meteor, $reactive, {
      subscriptions: ['ingredients'],
      helpers: {
        ingredient() {
          return _.cloneDeep(Ingredients.findOne({_id:new Mongo.ObjectID(this.ingredientid)}));
        }
      }
    });
    this.$timeout = $timeout;
	}
	save(ingredient) {
		Ingredients.update({_id:new Mongo.ObjectID(this.ingredientid)}, {$set:resolve(ingredient)});
    this.saved = true;
    this.$timeout(() => {
      this.saved = false;
    }, 5000);
	}
}

export default angular.module('edit-ingredient', [
  angularMeteor,
  form.name
])
  .component('editingredient', {
    templateUrl: template,
    controller: EditIngredientCtrl,
    bindings: {
    	ingredientid: '<'
    }
  });
