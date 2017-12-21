import { Mongo } from 'meteor/mongo';
 
export const Deleted = new Mongo.Collection('deleted', {idGeneration: 'MONGO'});

if (Meteor.isServer) {
  Meteor.publish('deleted', function() {
  	return Deleted.find();
  });
}
