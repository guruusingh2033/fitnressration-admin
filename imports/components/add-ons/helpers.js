export function resolve(addOn) {
	return {
		name: addOn.name,
		sku: addOn.sku,
		description: addOn.description,
		specifications: addOn.specifications,
		variantType: addOn.variantType,
		price: parseFloat(addOn.price),
		images: addOn.images,
		variants: addOn.variants,
	};
}
