import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { AdminComponent } from '../../../AdminComponent';
import { Sides } from '../../../api/sides';
import { Ingredients } from '../../../api/ingredients';
_ = lodash;

function selection(options, list, predicate) {
	var sel = {};
	for (var option of options) {
		((option) => {
			var p = predicate(option);
  		Object.defineProperty(sel, option._id._str, {
  			get: () => {
  				return _.some(list, p);
  			},
  			set: (value) => {
  				if (value) {
  					list.push(option._id);
  				}
  				else {
  					_.remove(list, p);
  				}
  			}
  		})    			
		})(option);
	}
	return sel;
}

class MealFormCtrl extends AdminComponent  {
	constructor($scope, $meteor, $reactive) {
    super($scope, $meteor, $reactive, {
      subscriptions: ['sides', 'ingredients'],
      uses: ['mealPlans', 'portions']
    });

    this.allergenSelection = {};
    this.autorun(() => {
    	var allergens = Ingredients.find({type:'allergen'}).fetch();
    	if (this.meal) {
		    this.allergenSelection = selection(allergens, this.meal.allergens, (allergen) => {
		    	return (a) => {return a._str == allergen._id._str};
		    });
    	}
    });

    this.helpers({
    	sides() {
    		return Sides.find();
    	},
    	mainIngredients() {
    		return Ingredients.find({type:'main'});
    	},
    	allergens() {
    		return Ingredients.find({type:'allergen'});
    	},
    });
	}

	save() {
		this.onSave({
			meal: this.meal
		});
	}
}

export default angular.module('meal-form', [
  angularMeteor,
])
  .component('mealform', {
    templateUrl: template,
    controller: MealFormCtrl,
    bindings: {
      onSave: '&',
      meal: '<'
    }
  });
