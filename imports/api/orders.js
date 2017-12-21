import { Mongo } from 'meteor/mongo';
 
export const Orders = new Mongo.Collection('orders', {idGeneration: 'MONGO'});
import { formatDate } from '../helpers';

if (Meteor.isServer) {
  Meteor.publish('orders', function() {
  	return Orders.find();
  });

  Meteor.publish('ordersByDate', function(minDate, maxDate) {
  	return Orders.find({'deliveryOptions.date':{$gte:minDate, $lt:maxDate}});
  });

  Meteor.publish('orderById', function(id) {
  	return Orders.find(id);
  });

  Meteor.publish('futureOrders', function(id) {
  	return Orders.find({'deliveryOptions.date':{$gte:formatDate(new Date)}});
  });
}
