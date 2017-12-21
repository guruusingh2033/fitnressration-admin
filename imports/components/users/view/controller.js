import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { formatDate, timeDisplay } from '../../../helpers';
import { mongoProperty } from '../../../client/mongoProperty';
import { AdminComponent } from '../../../AdminComponent';
_ = lodash;

[ Surveys, Orders ] = AdminComponent.collections('Surveys', 'Orders');

class UserCtrl extends AdminComponent {
	constructor($scope, $meteor, $reactive) {
    super($scope, $meteor, $reactive, {
      subscriptions: ['users', 'surveys'],
      helpers: {
        user() {
          return Meteor.users.findOne(this.userId);
        },
        surveys() {
          return Surveys.find({userId:this.userId}).fetch();
        }
      }
    });
    this.autorun(() => {
      if (!this.inited && this.subscriptions.users.ready()) {
        // this.order = Orders.findOne({_id:new Mongo.ObjectID(this.order)});
        // this.user = Meteor.users.findOne({_id:this.order.userId});        
        // mongoProperty(this, 'flagged', Orders, this.order, 'flagged', false);
        this.inited = true;
      }
    });
	}

  sendResetPasswordEmail() {
    Meteor.call('sendResetPasswordEmail', this.userId);
  }
  // timeDisplay(time) {
  //   return timeDisplay(time);
  // }
  // printInvoice() {
  //   window.open(Meteor.settings.public.userDashboardUrl + 'api/admin/invoices?orders=' + this.order._id._str);
  // }
}

export default angular.module('user', [
  angularMeteor
])
  .component('user', {
    templateUrl: template,
    controller: UserCtrl,
    bindings: {
      userId: '<',
    }
  });
