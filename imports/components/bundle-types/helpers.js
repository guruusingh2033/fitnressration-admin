export function resolve(bundleType) {
	return {
		icon: bundleType.icon,
		name: bundleType.name,
		description: bundleType.description,
		mealPlan: bundleType.mealPlan,
		portion: bundleType.portion,
		sku: bundleType.sku,
		basicMeals: parseInt(bundleType.basicMeals),
		premiumMeals: parseInt(bundleType.premiumMeals),
		price: parseFloat(bundleType.price),
		deliveryFee: bundleType.deliveryFee
	};
}
