import { Mongo } from 'meteor/mongo';
 
export const Portions = new Mongo.Collection('portions', {idGeneration: 'MONGO'});

if (Meteor.isServer) {
  Meteor.publish('portions', function() {
  	return Portions.find();
  });
}
