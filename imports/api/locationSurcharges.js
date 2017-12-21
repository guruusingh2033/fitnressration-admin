import { Mongo } from 'meteor/mongo';
 
export const LocationSurcharges = new Mongo.Collection('locationSurcharges', {idGeneration: 'MONGO'});
LocationSurcharges.attachSchema(new SimpleSchema({
	surcharge: { type: Number, decimal: true },
	postalPrefix: { type: String }
}), {transform:true});

if (Meteor.isServer) {
  Meteor.publish('locationSurcharges', function() {
  	return LocationSurcharges.find();
  });
}
