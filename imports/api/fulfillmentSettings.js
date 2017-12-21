import { Mongo } from 'meteor/mongo';
 
export const FulfillmentSettings = new Mongo.Collection('fulfillmentSettings', {idGeneration: 'MONGO'});
FulfillmentSettings.attachSchema(new SimpleSchema({
	deliveryFee: { type: Number, decimal: true },
	'timestamps.deliveryFee': { type: Date, optional: true },

	freeDeliveryThreshold: { type: Number },
	'timestamps.freeDeliveryThreshold': { type: Date, optional: true },

	minDays: { type: Number },
	'timestamps.minDays': { type: Date, optional: true },
	
	cutoffTime: { type: Number },
	'timestamps.cutoffTime': { type: Date, optional: true },
}), {transform:true});

if (Meteor.isServer) {
  Meteor.publish('fulfillmentSettings', () => {
  	return FulfillmentSettings.find();
  });
}
