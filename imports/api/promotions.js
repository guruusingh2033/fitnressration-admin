import { Mongo } from 'meteor/mongo';
 
export const Promotions = new Mongo.Collection('promotions', {idGeneration: 'MONGO'});
Promotions.attachSchema(new SimpleSchema({
	name: {type: String },
	deliveryFee: { type: Boolean, defaultValue: false },
	start: { type: String },
	end: { type: String },
	fulfillmentStart: { type: String, optional: true },
	fulfillmentEnd: { type: String, optional: true },
	discount: { type: Number, optional: true },
	overridePrice: { type: Number, optional: true, decimal: true },
	type: { type: String },
	promoCode: { type: String },
	sku: { type: String },
	usageLimit: { type: Number, optional: true },

	premiumAllowance: { type: Number, optional: true },
	premiumCap: { type: Number, optional: true },

	mealPlan: { type: SimpleSchema.RegEx.Id, optional: true, defaultValue: null },
	portion: { type: SimpleSchema.RegEx.Id, optional: true, defaultValue: null },
	bundleType: { type: SimpleSchema.RegEx.Id, optional: true, defaultValue: null }
}), {transform:true});

if (Meteor.isServer) {
  Meteor.publish('promotions', function() {
  	return Promotions.find();
  });
}
