import { Mongo } from 'meteor/mongo';
 
// export const Users = new Mongo.Collection('users', {idGeneration: 'MONGO'});

if (Meteor.isServer) {
  Meteor.publish('users', function() {
  	return Meteor.users.find();
  });
}
