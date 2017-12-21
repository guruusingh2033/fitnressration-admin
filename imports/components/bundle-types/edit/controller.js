import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import form from '../form/controller';
import { BundleTypes } from '../../../api/bundleTypes';
import { AdminComponent } from '../../../AdminComponent';
import { resolve } from '../helpers';
_ = lodash;


class EditBundleTypeCtrl extends AdminComponent {
	constructor($scope, $meteor, $reactive, $timeout) {
    super($scope, $meteor, $reactive);
    this.subscribe('bundleTypes');
    this.helpers({
    	bundleType() {
    		return _.cloneDeep(BundleTypes.findOne({_id:new Mongo.ObjectID(this.bundleTypeId)}));
    	}
    });
    this.$timeout = $timeout;
	}
	save(bundleType) {
		BundleTypes.update({_id:new Mongo.ObjectID(this.bundleTypeId)}, {$set:resolve(bundleType)});
    this.saved = true;
    this.$timeout(() => {
      this.saved = false;
    }, 5000);
	}
}

export default angular.module('edit-bundle-type', [
  angularMeteor,
  form.name
])
  .component('editbundletype', {
    templateUrl: template,
    controller: EditBundleTypeCtrl,
    bindings: {
    	bundleTypeId: '<'
    }
  });
