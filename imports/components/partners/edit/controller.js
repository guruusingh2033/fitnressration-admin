import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import form from '../form/controller';
import { Partners } from '../../../api/partners';
import { AdminComponent } from '../../../AdminComponent';
import { resolve } from '../helpers';
_ = lodash;

class EditPartnerCtrl extends AdminComponent {
	constructor($scope, $meteor, $reactive, $timeout) {
    super($scope, $meteor, $reactive);
    this.subscribe('partners');
    this.helpers({
    	partner() {
    		return _.cloneDeep(Partners.findOne({_id:new Mongo.ObjectID(this.partnerId)}));
    	}
    });
    this.$timeout = $timeout;
	}
	save(partner) {
		Partners.update({_id:new Mongo.ObjectID(this.partnerId)}, {$set:resolve(partner)});
    this.saved = true;
    this.$timeout(() => {
      this.saved = false;
    }, 5000);
	}
}

export default angular.module('edit-partner', [
  angularMeteor,
  form.name
])
  .component('editpartner', {
    templateUrl: template,
    controller: EditPartnerCtrl,
    bindings: {
    	partnerId: '<'
    }
  });
