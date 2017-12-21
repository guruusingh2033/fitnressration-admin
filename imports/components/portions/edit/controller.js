import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import form from '../form/controller';
import { Portions } from '../../../api/portions';
import { AdminComponent } from '../../../AdminComponent';
import { resolve } from '../helpers';
_ = lodash;


class EditPortionCtrl extends AdminComponent {
	constructor($scope, $meteor, $reactive, $timeout) {
    super($scope, $meteor, $reactive);
    this.subscribe('portions');
    this.helpers({
    	portion() {
    		return _.cloneDeep(Portions.findOne({_id:new Mongo.ObjectID(this.portionId)}));
    	}
    });
    this.$timeout = $timeout;
	}
	save(portion) {
		Portions.update({_id:new Mongo.ObjectID(this.portionId)}, {$set:resolve(portion)});
    this.saved = true;
    this.$timeout(() => {
      this.saved = false;
    }, 5000);
	}
}

export default angular.module('edit-portion', [
  angularMeteor,
  form.name
])
  .component('editportion', {
    templateUrl: template,
    controller: EditPortionCtrl,
    bindings: {
    	portionId: '<'
    }
  });
