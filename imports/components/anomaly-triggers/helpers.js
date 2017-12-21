export function resolve(anomalyTrigger) {
	return {
		productType: anomalyTrigger.productType,
		meal: anomalyTrigger.productType == 'meal' ? (anomalyTrigger.meal == 'all' ? null : anomalyTrigger.meal) : null,
		portion: anomalyTrigger.productType == 'meal' ? (anomalyTrigger.portion._str == 'all' ? null : new Mongo.ObjectID(anomalyTrigger.portion._str)) : null,
		mealPlan: anomalyTrigger.productType == 'meal' ? (anomalyTrigger.mealPlan._str == 'all' ? null : new Mongo.ObjectID(anomalyTrigger.mealPlan._str)) : null,
		addOn: anomalyTrigger.productType == 'addOn' ? (anomalyTrigger.addOn._str == 'all' ? null : new Mongo.ObjectID(anomalyTrigger.addOn._str)) : null,
		quantity: parseInt(anomalyTrigger.quantity),
		delay: parseInt(anomalyTrigger.delay),
		alert: {
			title: anomalyTrigger.alert.title,
			message: anomalyTrigger.alert.message
		},
		flagOrder: anomalyTrigger.flagOrder,
		matchOrders: anomalyTrigger.matchOrders
	};
}