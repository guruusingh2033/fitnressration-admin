import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import form from '../form/controller';
import { AddOns } from '../../../api/addOns';
import { AdminComponent } from '../../../AdminComponent';
import { resolve } from '../helpers';
_ = lodash;


class EditAddOn extends AdminComponent {
	constructor($scope, $meteor, $reactive, $timeout) {
    super($scope, $meteor, $reactive);
    this.subscribe('addOns');
    this.helpers({
    	addOn() {
    		return _.cloneDeep(AddOns.findOne({_id:new Mongo.ObjectID(this.addOnId)}));
    	}
    });
    this.$timeout = $timeout;
	}
	save(addOn) {
		AddOns.update({_id:new Mongo.ObjectID(this.addOnId)}, {$set:resolve(addOn)});
    this.saved = true;
    this.$timeout(() => {
      this.saved = false;
    }, 5000);
	}
}

export default angular.module('edit-add-on', [
  angularMeteor,
  form.name
])
  .component('editaddon', {
    templateUrl: template,
    controller: EditAddOn,
    bindings: {
    	addOnId: '<'
    }
  });
