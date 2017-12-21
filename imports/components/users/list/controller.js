import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './template.html';
import { ListAdminComponent } from '../../../ListAdminComponent';
import { AdminComponent } from '../../../AdminComponent';

// [ MealPlans, Portions, Ingredients ] = AdminComponent.collections('MealPlans', 'Portions', 'Ingredients');
// Users = Meteor.users;

_ = lodash;

class UsersCtrl extends ListAdminComponent {
	constructor($scope, $meteor, $reactive) {
    super($scope, $meteor, $reactive, {
      subscriptions: ['users'],
      helpers: {
        users() {
          // return Meteor.users.find().fetch();
          var filter = this.getReactively('filter');
          var query = {};
          if (filter) {
            // var mealPlans = MealPlans.find({name:new RegExp(filter, 'i')}).fetch().map(mealPlan => mealPlan._id);
            // var portions = Portions.find({name:new RegExp(filter, 'i')}).fetch().map(portion => portion._id);
            // var ingredients = Ingredients.find({name:new RegExp(filter, 'i')}).fetch().map(ingredient => ingredient._id);
            query.$or = [ { 'profile.firstName': new RegExp(filter, 'i') }, { 'profile.phoneNumber': new RegExp(filter, 'i') }, { 'profile.surname': new RegExp(filter, 'i') }, { 'username': new RegExp(filter, 'i') }, { 'profile.deliveryAddresses': { $elemMatch: { $or: [ { address: new RegExp(filter, 'i') }, { postalCode: new RegExp(filter, 'i') } ] } } } ];
          }
          return Meteor.users.find(query).fetch();
        }
      }
    });
	}

  get collection() { return Meteor.users; }
  get documents() { return this.users; }
}

export default angular.module('users', [
  angularMeteor
])
  .component('users', {
    templateUrl: template,
    controller: UsersCtrl
  });
