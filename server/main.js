import { Meteor } from 'meteor/meteor';
import '../imports/api/users';
import { formatDate, mealSales } from '../imports/helpers';
import { addDays, today } from '../imports/date';
import { StockCalculator } from '../imports/StockCalculator';
import { HTTP } from 'meteor/http';
import { Orders } from '../imports/api/orders';
import { Portions } from '../imports/api/portions';
import { MealPlans } from '../imports/api/mealPlans';
import { BundleTypes } from '../imports/api/bundleTypes';
import { Meals } from '../imports/api/meals';
import { Ingredients } from '../imports/api/ingredients';
import { TimeSlots } from '../imports/api/timeSlots';
import { Blocks } from '../imports/api/blocks';
import { LocationSurcharges } from '../imports/api/locationSurcharges';
import { FulfillmentSettings } from '../imports/api/fulfillmentSettings';
import { Promotions } from '../imports/api/promotions';
import { MealStock } from '../imports/api/mealStock';
import { Sides } from '../imports/api/sides';
import { Surveys } from '../imports/api/surveys';
import { AddOns } from '../imports/api/addOns';
import { Partners } from '../imports/api/partners';
import { AnomalyTriggers } from '../imports/api/anomalyTriggers';
import { Deleted } from '../imports/api/deleted';
import { StockCache } from '../imports/api/stockCache';

_ = lodash;

var api = new Restivus({
	// useDefaultAuth: true,
	// auth: {
	// 	token: 'auth.apiKey'
	// }
});

// api.addRoute('compute-stock', {
// 	get: function() {
// 		computeStock(new Date(Date.parse(this.queryParams.date)));
// 		return '';
// 	}
// });

api.addRoute('export-inventory-status', {
	get: function() {
		console.log(this.queryParams);
    var filter = this.queryParams.filter;
    var query = {};
    if (filter) {
      var mealPlans = MealPlans.find({name:new RegExp(filter, 'i')}).fetch().map(mealPlan => mealPlan._id);
      var portions = Portions.find({name:new RegExp(filter, 'i')}).fetch().map(portion => portion._id);
      query.$or = [{name:new RegExp(filter, 'i')}, {sku:new RegExp(filter, 'i')}, {mealPlan:{$in:mealPlans}}, {portion:{$in:portions}}];
    }
    var meals = Meals.find(query).fetch();
    var rows = [];
    for (var meal of meals) {
    	var stockCalculator = new StockCalculator(meal._id);
    	var values = stockCalculator.forDate(this.queryParams.date);
    	rows.push({
    		'Product Name': meal.name,
    		'Meal Plan': MealPlans.findOne(meal.mealPlan).name,
    		'Portion': Portions.findOne(meal.portion).name,
    		'SKU': meal.sku,
    		'Initial': values.initial,
    		'Sales': values.sales,
    		'Non-sales': values.nonSales,
    		'Output': values.output,
    		'Restock': values.restock,
    		'Stock': values.stock,
    	});
    }
    this.response.setHeader('Content-type', 'text/csv');
    this.response.setHeader('Content-Disposition', 'attachment; filename=inventory-status.' + this.queryParams.date + '.csv');
  	this.response.write('"' + _.keys(rows[0] || {}).join('","') + '"\n');
  	for (var row of rows) {
	  	this.response.write('"' + _.values(row).join('","') + '"\n');
  	}
    this.done();
	}
});

api.addRoute('migrate-meal-stock', {
	get: function() {
		var mealStocks = MealStock.find({date:'2016-08-29', initial:null}).fetch();
		for (var mealStock of mealStocks) {
			MealStock.update(mealStock._id, {$set:{initial:mealStock.stock}});
		}
	}
});

function recordStock() {
	var _today = formatDate(today());
	var yesterday = formatDate(addDays(today(), -1));
	var meals = Meals.find().fetch();
	for (var meal of meals) {
		var yesterdaysStock = MealStock.findOne({date:yesterday, meal:meal._id});
		var values = StockCalculator.calculate(yesterdaysStock.initial, yesterday, meal._id, {
			findMealStock(mealId, date) {
				return MealStock.findOne({meal:mealId, date:date});
			}
		});

		// console.log(values);
		MealStock.update(yesterdaysStock._id, {$set:values});

		if (!MealStock.findOne({date:_today, meal:meal._id})) {
			MealStock.insert(_.assign({date:_today, meal:meal._id}, {initial:values.stock}));
		}
		else {
			MealStock.update({date:_today, meal:meal._id}, {$set:{initial:values.stock}});
		}
	}
}

api.addRoute('record-stock', {
	get: function() {
		recordStock();
		return '';
	}
});

api.addRoute('generate-stock-cache', {
	get: function() {
		var meals = Meals.find().fetch();
		var firstDate = '2016-08-29';
		for (var meal of meals) {
			var date = firstDate;
			var lastDate = formatDate(today());
			var prevDate, prevValues;
			do {
				var values = StockCalculator.calculate(date == firstDate ? (MealStock.findOne({meal:meal._id, date:date}) || {initial:0}).initial : prevValues.stock, date, meal._id, {
					findMealStock(mealId, date) {
						return MealStock.findOne({meal:mealId, date:date});
					}
				});
				if (!MealStock.findOne({date:date, meal:meal._id})) {
					MealStock.insert(_.assign({date:date, meal:meal._id}, values));
				}
				else {
					MealStock.update({date:date, meal:meal._id}, {$set:values});
				}
				prevDate = date;
				prevValues = values;
				date = formatDate(addDays(date, 1));
			} while (date != lastDate);
		}
		return '';
	}
});

api.addRoute('stock', {
	get: function() {
		var meals = Meals.find().fetch();
		var yesterday = addDays(today(), -1);
		var stockCache = StockCache.findOne({});
		var yesterdaysStock;
		if (!stockCache || stockCache.timestamp.valueOf() != yesterday.valueOf()) {
			yesterdaysStock = {};
			for (let meal of meals) {
				let stockCalculator = new StockCalculator(meal._id);
				yesterdaysStock[meal._id._str] = (stockCalculator.forDate(yesterday) || {stock:0}).stock;
			}
			if (stockCache) {
				StockCache.update({_id:stockCache._id}, {$set:{timestamp:yesterday, stock:yesterdaysStock}});
			}
			else {
				StockCache.insert({timestamp:yesterday, stock:yesterdaysStock});
			}
		}
		else {
			yesterdaysStock = stockCache.stock;
		}
		var stock = {};
		for (let meal of meals) {
			stock[meal._id._str] = StockCalculator.calculate(yesterdaysStock[meal._id._str], formatDate(today()), meal._id, {
				findMealStock(mealId, date) {
					return MealStock.findOne({meal:mealId, date:date});
				}
			}).stock;
		}
		return stock;
	}
});

function computeStock(date) {
	var previousDay = formatDate(addDays(date, -1));

	var mealStocks = MealStock.find({date:previousDay}).fetch();

	for (var mealStock of mealStocks) {
		var sales = mealSales(mealStock.meal, previousDay);
		var output = sales + (mealStock.nonSales || 0);
		var final = (mealStock.stock - output) + (mealStock.restock || 0);
		MealStock.update({
			meal: mealStock.meal,
			date: formatDate(date)
		}, {$set:{
			stock: final
		}}, {upsert: true});
	}
}

Meteor.startup(() => {
});

SyncedCron.add({
	name: 'Update stock for day.',
	schedule(parser) {
		return parser.cron('0 0 */1 * *');
	},
	job() {
		recordStock();
	}
});
SyncedCron.start();

Meteor.methods({
	uploadImage(args) {
		var result = HTTP.post(Meteor.settings.public.imageServerUrl + '/upload.php?type=' + (args.type || 'raster'), {
			content:args.data,
		});
		console.log(result);
		if (result.data.result == 'success') {
			return result.data;
			// Meteor.users.update({_id:Meteor.userId()}, {$set:{'profile.picture':result.data.url}});
		}
	},
	clearStockCache() {
		StockCache.remove({});
	},
	sendResetPasswordEmail(userId) {
		Accounts.sendResetPasswordEmail(userId);
	}
});