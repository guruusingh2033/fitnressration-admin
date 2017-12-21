import { Mongo } from 'meteor/mongo';
 
export const Sides = new Mongo.Collection('sides', {idGeneration: 'MONGO'});

if (Meteor.isServer) {
  Meteor.publish('sides', function() {
  	return Sides.find();
  });
}
