import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { formatDate, timeDisplay } from '../../../helpers';
import { mongoProperty } from '../../../client/mongoProperty';
import { AdminComponent } from '../../../AdminComponent';
_ = lodash;

class OrderCtrl extends AdminComponent {
	constructor($scope, $meteor, $reactive) {
    super($scope, $meteor, $reactive, {
      subscriptions: ['users']
    });
    this._subscribe('orderById', () => {
      return [new Mongo.ObjectID(this.order)];
    })
    this.autorun(() => {
      if (!this.inited && this.subscriptions.users.ready()) {
        this.order = Orders.findOne({_id:new Mongo.ObjectID(this.order)});
        if (this.order) {
          this.user = Meteor.users.findOne({_id:this.order.userId});        
          mongoProperty(this, 'flagged', Orders, this.order, 'flagged', false);
          this.inited = true;
        }
      }
    });
	}
  timeDisplay(time) {
    return timeDisplay(time);
  }
  printInvoice() {
    window.open(Meteor.settings.public.userDashboardUrl + 'api/admin/invoices?orders=' + this.order._id._str);
  }
}

export default angular.module('order', [
  angularMeteor
])
  .component('order', {
    templateUrl: template,
    controller: OrderCtrl,
    bindings: {
      order: '<',
    }
  });
