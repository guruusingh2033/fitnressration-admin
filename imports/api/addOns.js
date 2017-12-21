import { Mongo } from 'meteor/mongo';
 
export const AddOns = new Mongo.Collection('addOns', {idGeneration: 'MONGO'});

if (Meteor.isServer) {
  Meteor.publish('addOns', function() {
  	return AddOns.find();
  });
}
