import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { AdminComponent } from '../../../AdminComponent';
_ = lodash;

class AddOnFormCtrl extends AdminComponent {
	constructor($scope, $meteor, $reactive) {
    super($scope, $meteor, $reactive);
    console.log(this.addOn);
	}

	save() {
		this.onSave({addOn:this.addOn});
	}

  removeImage(image) {
    _.pull(this.addOn.images, image);
  }

  addImage(image) {
    this.addOn.images.push(image);
  }

  removeVariant(index) {
    this.addOn.variants.splice(index, 1);
  }

  addVariant() {
    this.addOn.variants.push(this.newVariant);
    this.newVariant = null;
  }
}

export default angular.module('add-on-form', [
  angularMeteor
])
  .component('addonform', {
    templateUrl: template,
    controller: AddOnFormCtrl,
    bindings: {
    	addOn: '<',
      onSave: '&',
    }
  });
