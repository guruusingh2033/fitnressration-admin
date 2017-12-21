export function resolve(ingredient) {
	return {
		icon: ingredient.icon,
		name: ingredient.name,
		type: ingredient.type,
		action: ingredient.type == 'allergen' ? ingredient.action : null,
		surcharge: ingredient.type == 'allergen' ? parseFloat(ingredient.surcharge) : null,
	};
}
