import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import form from '../form/controller';
import { Sides } from '../../../api/sides';
import { AdminComponent } from '../../../AdminComponent';
_ = lodash;

function resolve(side) {
	return {
		name: side.name
	};
}

class EditSiteCtrl extends AdminComponent {
	constructor($scope, $meteor, $reactive, $timeout) {
    super($scope, $meteor, $reactive);
    this.subscribe('sides');
    this.helpers({
    	side() {
    		return _.cloneDeep(Sides.findOne({_id:new Mongo.ObjectID(this.sideid)}));
    	}
    });
    this.$timeout = $timeout;
	}
	save(side) {
		Sides.update({_id:new Mongo.ObjectID(this.sideid)}, {$set:resolve(side)});
    this.saved = true;
    this.$timeout(() => {
      this.saved = false;
    }, 5000);
	}
}

export default angular.module('edit-side', [
  angularMeteor,
  form.name
])
  .component('editside', {
    templateUrl: template,
    controller: EditSiteCtrl,
    bindings: {
    	sideid: '<'
    }
  });
