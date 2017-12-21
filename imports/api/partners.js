import { Mongo } from 'meteor/mongo';
export const Partners = new Mongo.Collection('partners', {idGeneration: 'MONGO'});
if (Meteor.isServer) {
  Meteor.publish('partners', function() {
  	return Partners.find();
  });
}
