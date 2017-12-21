import { Mongo } from 'meteor/mongo';
export const StockCache = new Mongo.Collection('stockCache', {idGeneration: 'MONGO'});
