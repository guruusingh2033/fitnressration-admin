import { Mongo } from 'meteor/mongo';
 
export const AnomalyTriggers = new Mongo.Collection('anomalyTriggers', {idGeneration: 'MONGO'});

if (Meteor.isServer) {
  Meteor.publish('anomalyTriggers', function() {
    return AnomalyTriggers.find();
  });
}
