import { Mongo } from 'meteor/mongo';
 
export const Ingredients = new Mongo.Collection('ingredients', {idGeneration: 'MONGO'});

if (Meteor.isServer) {
  Meteor.publish('ingredients', function() {
  	return Ingredients.find();
  });
}
