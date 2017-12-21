import { Mongo } from 'meteor/mongo';
import { formatDate } from '../helpers';
 
export const MealStock = new Mongo.Collection('mealStock', {idGeneration: 'MONGO'});
MealStock.attachSchema(new SimpleSchema({
	initial: { type: Number, optional: true },
	adjustment: { type: Number, optional: true },
	restock: { type: Number, optional: true },
	output: { type: Number, optional: true },
	sales: { type: Number, optional: true },
	nonSales: { type: Number, optional: true },
	stock: { type: Number, optional: true },
	
	lastUpdated: { type: Object, optional: true, blackbox: true },
	meal: { type: Mongo.ObjectID },
	date: { type: String },
}), {transform:true});

if (Meteor.isServer) {
  Meteor.publish('mealStock', function() {
  	return MealStock.find();
  });

  Meteor.publish('mealStockForDates', function(minDate, maxDate) {
  	return MealStock.find({date:{$gte:minDate, $lte:maxDate}});
  });
}
